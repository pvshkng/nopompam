import { tool, streamObject } from "ai";
import { z } from "zod";
import type { ModelMessage } from 'ai';
import type { DocumentProps } from './types';
import { storeArtifact } from '@/lib/mongo/artifact-store';
import { artifactWriter } from "@/lib/ai/client";
import { stringifyToolOutputs } from "@/lib/ai/utils";

const kind = 'sheet';

const toolDescription = `
## createSheet
# The "createSheet" tool creates and updates spreadsheet artifact that render to the user on a space next to the conversation.
# Use this tool when asked to create or work on spreadsheets.
`

const createInstructions = (title: string, additionalInstructions?: string) => {

    const instructions = `
        <instructions>
        Generate a spreadsheet about the given topic in CSV format.
        
        Guidelines:
        - First row should contain column headers
        - Subsequent rows contain the data
        - Use comma as delimiter
        - Keep data concise and relevant
        - Use realistic and accurate values
        
        Example:
        Recipe Name,Cuisine,Prep Time
        Lasagna,Italian,30
        Tikka Masala,Indian,20
        </instructions>

        Now generate a spreadsheet about: ${title}

        ${additionalInstructions ?
            `<additional_instructions>
            Here are some additional instructions to follow while creating the spreadsheet: 
            ${additionalInstructions}
        </additional_instructions>`
            : ''}
        `
    return instructions;
}

const spreadsheetSchema = z.object({
    csv: z.string().describe("CSV formatted data with headers in the first row"),
});

export const createSheet = ({ threadId, user, getMemory, writer }: DocumentProps) =>
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
                const { fullStream } = streamObject({
                    model: artifactWriter,
                    schema: spreadsheetSchema,
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

                    if (type === "object") {
                        const { object } = delta;
                        const { csv } = object;

                        if (csv) {
                            writer.write({
                                type: "data-document",
                                data: {
                                    id: id,
                                    type: "text",
                                    content: csv,
                                },
                            });
                            draftContent = csv;
                        }
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
