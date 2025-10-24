import { UIMessageStreamWriter, tool } from "ai";
import { z } from "zod";
import type { ModelMessage } from 'ai';
import type { DocumentProps } from './types';
import { streamText } from 'ai';
import { storeArtifact } from '@/lib/mongo/artifact-store';
import { artifactWriter } from "@/lib/ai/client";
import { stringifyToolOutputs } from "@/lib/ai/utils";

const kind = 'text';

const toolDescription = `
## createText
# The "createText" tool creates and updates text artifact that render to the user on a space next to the conversation (referred to as the "dossier").
# Use this tool when asked to work on writing that's long enough like article / essay.
# Only invoke this tool once for each document you want to create.
# **DO NOT REPEAT THE GENERATED CONTENT OR RESULT OF THIS TOOL SINCE THE RESULT WILL BE VISIBLE TO THE USER.**
# You may let the user know that you have created a document and they can view it on the side panel.
`

const createInstructions = (title: string, additionalInstructions?: string) => {

    const instructions = `
        <instructions>
        Write document about the given topic. 
        The content will be rendered in Tiptap editor, so format it accordingly.
        Do not include anything other than the content of the document.

        Use **HTML** to format the content. 
        For example:
        - USE tables for comparison or data presentation regardless of quality or quantity of data
        - USE headings to define sections
        - USE horizontal rules to split sections
        - USE bullet points for entries, etc.
        - INCLUDE relevant images if provided in the context, chat history or other sources.
        - DO NOT MAKE UP IMAGES, only use images that are provided.
        - ALWAYS include references to sources with href at the end if available.

        HTML MUST BE VALID and well-formed.

        Prohibitions:
        - DO NOT WRAP THE OUTPUT IN \`\`\`html \`\`\`
        - DO NOT INCLUDE <html> tag, just output the content
        - DO NOT LEAVE TRAILING EMPTY BULLET POINTS
        - DO NOT INCLUDE BACKTICKS OR MARKDOWN SYNTAX.
        </instructions>

        Now write a document about the following topic:
        ${title}

        ${additionalInstructions ?
            `<additional_instructions>
            Here are some additional instructions to follow while writing the document: 
            ${additionalInstructions}
        </additional_instructions>`
            : ''}
        `
    return instructions;
}

export const createText = ({ threadId, user, getMemory, writer }: DocumentProps) =>
    tool({
        description: toolDescription,
        inputSchema: z.object({
            title: z.string().describe("The title of the artifact. If the title is not provided, it will be inferred from the prompt."),
            additionalInstructions: z.string().optional().describe("Additional instructions from the user to guide the content generation of the document such as tone, style, specific points to cover, etc."),
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
