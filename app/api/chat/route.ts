import { NextRequest } from "next/server";
import { streamText, smoothStream, convertToCoreMessages, appendResponseMessages, createIdGenerator, createDataStreamResponse, createDataStream } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { openai, createOpenAI } from '@ai-sdk/openai';
import { tools } from "@/lib/ai";
import { documentSearch } from "@/lib/ai/tool/document-search";
import { saveChat } from "@/lib/mongo/chat-store";
import { generateTitle } from "@/lib/actions/ai/generate-title";
import { experimental_createMCPClient } from "ai"
import { createArtifact } from "@/lib/ai/tool/create-artifact"

export const maxDuration = 60;

export async function POST(req: NextRequest) {

    try {

        /* const mcpClient = await experimental_createMCPClient({
            transport: { type: "sse", url: "https://vector-search-mcp-server.onrender.com/sse", }, onUncaughtError: () => { }
        })

        const mcpTools = await mcpClient.tools() */
        const { messages, id, user, model } = await req.json();
        let provider
        switch (model) {
            case "typhoon-v2.1-12b-instruct":
                provider = createOpenAI({
                    apiKey: process.env.TYPHOON_API_KEY,
                    baseURL: process.env.TYPHOON_URL,
                    headers: {
                        "Authorization": `Bearer ${process.env.TYPHOON_API_KEY}`,
                    }
                });
                break;

            case "gemini-2.5-pro":
            case "gemini-2.5-pro-preview-05-06":
            case "gemini-2.5-flash":
            case "gemini-2.5-flash-preview-04-17":
            case "gemini-2.5-flash-lite-preview-06-17":
            default:
                provider = createGoogleGenerativeAI({
                    apiKey: process.env.GOOGLE_API_KEY,
                    baseURL: process.env.GOOGLE_API_ENDPOINT,
                });
                break;
        }
        const system_prompt = `
        You are Nopompam, an AI-powered assistant.

        # Instructions
        Nopompam responds using Markdown format to visually enhance the response.
        Nopompam uses table to present information in a structured way.
        Nopompam can use code blocks to display code snippets.
        Nopompam can use bullet points to list items.

        ## createArtifact
        // # The "createArtifact" tool creates and updates text documents that render to the user on a space next to the conversation (referred to as the "dossier").
        `

        return createDataStreamResponse({
            execute: async dataStream => {
                const result = streamText({
                    model: provider(model),
                    messages: convertToCoreMessages([{ role: "system", content: system_prompt }, ...messages]),

                    experimental_telemetry: { isEnabled: true },
                    experimental_transform: smoothStream({
                        delayInMs: 20, // optional: defaults to 10ms
                        chunking: 'word', // optional: defaults to 'word'
                    }),
                    // ...tools, 
                    // documentSearch
                    tools: { createArtifact: createArtifact({ threadId: id, user: user, dataStream: dataStream }) },
                    maxSteps: 3,
                    toolCallStreaming: true,
                    toolChoice: "auto",


                    experimental_generateMessageId: createIdGenerator({
                        prefix: 'msgs',
                        size: 16,
                    }),

                    onChunk() { },

                    //save chat
                    async onFinish({ response }) {
                        let title = undefined;
                        if (messages.length === 1) {
                            title = await generateTitle(messages[0].content);
                            dataStream.writeMessageAnnotation({ title: title });
                        }
                        saveChat({
                            _id: id,
                            title: title,
                            user: user,
                            messages: appendResponseMessages({
                                messages,
                                responseMessages: response.messages,
                            }),
                        });
                    },
                    onError(error) {
                        console.error("Error in chat route: ", error);
                        //dataStream.writeMessageAnnotation({ error: error.message });
                    }

                });

                await result.mergeIntoDataStream(dataStream, {
                    experimental_sendStart: true,
                    experimental_sendFinish: true
                })
            }
        })

    } catch (error) {
        console.error("Error in chat route: ", error);
        throw error
    }

}