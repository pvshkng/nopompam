import { tool } from "ai";
import { z } from "zod";
import type { ModelMessage } from 'ai';
import type { DocumentProps } from './types';
import { streamText } from 'ai';
import { storeArtifact } from '@/lib/mongo/artifact-store';
import { artifactWriter } from "@/lib/ai/client";
import { stringifyToolOutputs } from "@/lib/ai/utils";

const kind = 'python';

const toolDescription = `
## createPython
# The "createPython" tool creates and updates text artifact that render to the user on a space next to the conversation (referred to as the "dossier").
# Use this tool when asked to work on writing that's long enough like article / essay.
# Only invoke this tool once for each document you want to create.
# **DO NOT REPEAT THE GENERATED CONTENT OR RESULT OF THIS TOOL SINCE THE RESULT WILL BE VISIBLE TO THE USER.**
# You may let the user know that you have created a document and they can view it on the side panel.
`

const createInstructions = (title: string, additionalInstructions?: string) => {

    const instructions = `
        <instructions>
        Write Python code about the given topic. 
        The content will be rendered in Pyodide editor, make sure to it can be executed without importing any libraries.
        Do not include anything other than the code.

        PYTHON CODE MUST BE VALID and well-formed.

        Prohibitions:
        - DO NOT WRAP THE OUTPUT IN \`\`\`python \`\`\`
        </instructions>

        Now generate this Python code about:
        ${title}

        ${additionalInstructions ?
            `<additional_instructions>
            Here are some additional instructions to follow while generating the code: 
            ${additionalInstructions}
        </additional_instructions>`
            : ''}
        `
    return instructions;
}

export const createPython = ({ threadId, user, getMemory, writer }: DocumentProps) =>
    tool({
        description: toolDescription,
        inputSchema: z.object({
            title: z.string().describe("The title of the Python code. Infer from the prompt if not provided."),
            additionalInstructions: z.string().optional().describe("Additional instructions from the user to guide the code generation."),
        }),
        execute: async ({ title, additionalInstructions }, { toolCallId }) => {
            const id = toolCallId; // to change to a unique id
            const memory = getMemory();
            const cleanedMessages = stringifyToolOutputs(memory);
            const prompt = [
                ...cleanedMessages,
                {
                    role: 'user',
                    content: createInstructions(title, additionalInstructions),
                },
            ] as ModelMessage[];

            try {
                writer.write({
                    type: 'data-document',
                    data: {
                        id: id,
                        type: 'init',
                        content: { id, title, kind, },
                    },
                });

                writer.write({
                    type: 'data-document',
                    data: {
                        id: id,
                        type: 'start',
                        content: '',
                    },
                });

                let draftContent = '';
                const { fullStream } = streamText({
                    model: artifactWriter,
                    messages: prompt,
                    onFinish: async ({ response }) => {
                        writer.write({
                            type: 'data-document',
                            data: {
                                id: id,
                                type: 'stop',
                                content: '',
                            },
                        });

                        await storeArtifact({
                            artifactId: id,
                            threadId: threadId,
                            user: user,
                            kind: kind,
                            title: title,
                            content: draftContent,
                        });
                    },
                    onError: (error) => {
                        console.error('Error during artifact creation: ', error);
                        writer.write({
                            type: 'data-document',
                            data: {
                                id: id,
                                type: 'error',
                                content: error,
                            },
                        });
                    },
                });

                for await (const delta of fullStream) {
                    const { type } = delta;

                    if (type === 'text-delta') {
                        const { text } = delta;
                        draftContent += text;

                        writer.write({
                            type: 'data-document',
                            data: {
                                id: id,
                                type: 'text',
                                content: text,
                            },
                        });
                    }
                }

                return {
                    id,
                    title,
                    kind,
                    content: draftContent,
                };

            } catch (error) {
                console.error('Error during artifact creation: ', error);
                writer.write({
                    type: 'data-document',
                    data: {
                        id: id,
                        type: 'error',
                        content: error,
                    },
                });
                return error;
            }
        },
    });
