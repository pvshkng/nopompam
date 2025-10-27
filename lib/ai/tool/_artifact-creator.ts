// artifact-creator.ts
import { tool, streamText, streamObject } from "ai";
import { z } from "zod";
import type { ModelMessage } from 'ai';
import type { DocumentProps } from './types';
import { storeArtifact } from '@/lib/mongo/artifact-store';
import { artifactWriter } from "@/lib/ai/client";
import { stringifyToolOutputs } from "@/lib/ai/utils";

// ============= Types & Configs =============

type ArtifactKind = 'text' | 'python' | 'sheet';
type StreamType = 'text' | 'object';

interface ArtifactConfig {
    kind: ArtifactKind;
    streamType: StreamType;
    toolDescription: string;
    createInstructions: (title: string, additionalInstructions?: string) => string;
    schema?: z.ZodSchema;
    extractContent?: (object: any) => string;
}

// ============= Artifact Configurations =============

const ARTIFACT_CONFIGS: Record<ArtifactKind, ArtifactConfig> = {
    text: {
        kind: 'text',
        streamType: 'text',
        toolDescription: `
        ## createText
        # The "createText" tool creates and updates text artifact that render to the user on a space next to the conversation (referred to as the "dossier").
        # Use this tool when asked to work on writing that's long enough like article / essay.
        # Only invoke this tool once for each document you want to create.
        # **DO NOT REPEAT THE GENERATED CONTENT OR RESULT OF THIS TOOL SINCE THE RESULT WILL BE VISIBLE TO THE USER.**
        # You may let the user know that you have created a document and they can view it on the side panel.
        `,
        createInstructions: (title: string, additionalInstructions?: string) => `
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

        ${additionalInstructions ? `<additional_instructions>
            Here are some additional instructions to follow while writing the document: 
            ${additionalInstructions}
        </additional_instructions>` : ''}
    `,
    },

    python: {
        kind: 'python',
        streamType: 'text',
        toolDescription: `
        ## createPython
        # The "createPython" tool creates and updates text artifact that render to the user on a space next to the conversation (referred to as the "dossier").
        # Use this tool when asked to work on writing that's long enough like article / essay.
        # Only invoke this tool once for each document you want to create.
        # **DO NOT REPEAT THE GENERATED CONTENT OR RESULT OF THIS TOOL SINCE THE RESULT WILL BE VISIBLE TO THE USER.**
        # You may let the user know that you have created a document and they can view it on the side panel.
        `,
        createInstructions: (title: string, additionalInstructions?: string) => `
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

        ${additionalInstructions ? `<additional_instructions>
            Here are some additional instructions to follow while generating the code: 
            ${additionalInstructions}
        </additional_instructions>` : ''}
    `,
    },

    sheet: {
        kind: 'sheet',
        streamType: 'object',
        toolDescription: `
        ## createSheet
        # The "createSheet" tool creates and updates spreadsheet artifact that render to the user on a space next to the conversation.
        # Use this tool when asked to create or work on spreadsheets.
        `,
        createInstructions: (title: string, additionalInstructions?: string) => `
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

        ${additionalInstructions ? `<additional_instructions>
            Here are some additional instructions to follow while creating the spreadsheet: 
            ${additionalInstructions}
        </additional_instructions>` : ''}
    `,
        schema: z.object({
            csv: z.string().describe("CSV formatted data with headers in the first row"),
        }),
        extractContent: (object) => object.csv,
    },
};

// ============= Core Factory Function =============

function createArtifactTool(config: ArtifactConfig, props: DocumentProps) {
    const { kind, streamType, toolDescription, createInstructions, schema, extractContent } = config;
    const { threadId, user, getMemory, writer } = props;

    return tool({
        description: toolDescription,
        inputSchema: z.object({
            title: z.string().describe(
                kind === 'sheet'
                    ? "The title of the artifact. If the title is not provided, it will be inferred from the prompt."
                    : "The title of the artifact. Infer from the prompt if not provided."
            ),
            additionalInstructions: z.string().optional().describe(
                `Additional instructions from the user to guide the ${kind === 'python' ? 'code' : 'content'} generation.`
            ),
        }),
        execute: async ({ title, additionalInstructions }, { toolCallId }) => {
            const id = toolCallId;
            const memory = getMemory();
            const cleanedMessages = stringifyToolOutputs(memory);
            const prompt = [
                ...cleanedMessages,
                {
                    role: 'user',
                    content: createInstructions(title, additionalInstructions),
                },
            ] as ModelMessage[];

            // Helper function to write events
            const writeEvent = (type: string, content: any = '') => {
                writer.write({
                    type: 'data-document',
                    data: { id, type, content },
                });
            };

            try {
                // Initialize artifact
                writeEvent('init', { id, title, kind });
                writeEvent('start');

                let draftContent = '';

                // Common onFinish handler
                const onFinish = async () => {
                    writeEvent('stop');
                    await storeArtifact({
                        artifactId: id,
                        threadId,
                        user,
                        kind,
                        title,
                        content: draftContent,
                    });
                };

                // Common onError handler
                const onError = (error: any) => {
                    console.error('Error during artifact creation:', error);
                    writeEvent('error', error);
                };

                // Stream based on type
                if (streamType === 'text') {
                    const { fullStream } = streamText({
                        model: artifactWriter,
                        messages: prompt,
                        onFinish,
                        onError,
                    });

                    for await (const delta of fullStream) {
                        if (delta.type === 'text-delta') {
                            const { text } = delta;
                            draftContent += text;
                            writeEvent('text', text);
                        }
                    }
                } else {
                    // streamObject
                    const { fullStream } = streamObject({
                        model: artifactWriter,
                        schema: schema!,
                        prompt,
                        onFinish,
                        onError,
                    });

                    for await (const delta of fullStream) {
                        if (delta.type === 'object') {
                            const content = extractContent!(delta.object);
                            if (content) {
                                writeEvent('text', content);
                                draftContent = content;
                            }
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
                console.error('Error during artifact creation:', error);
                writeEvent('error', error);
                return error;
            }
        },
    });
}

// ============= Exported Individual Tools =============

export const createText = (props: DocumentProps) =>
    createArtifactTool(ARTIFACT_CONFIGS.text, props);

export const createPython = (props: DocumentProps) =>
    createArtifactTool(ARTIFACT_CONFIGS.python, props);

export const createSheet = (props: DocumentProps) =>
    createArtifactTool(ARTIFACT_CONFIGS.sheet, props);

// ============= Bonus: Batch Creator for Less Repetition =============

/**
 * Create all artifact tools at once with shared props
 * 
 * Usage:
 * const tools = createAllArtifactTools({ 
 *   threadId: id, 
 *   user: user, 
 *   getMemory: () => memory, 
 *   writer: writer 
 * });
 * 
 * Then use: tools.createText, tools.createSheet, tools.createPython
 */
export const createAllArtifactTools = (props: DocumentProps) => ({
    createText: createText(props),
    createSheet: createSheet(props),
    createPython: createPython(props),
});