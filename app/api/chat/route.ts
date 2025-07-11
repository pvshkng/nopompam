import { NextRequest } from "next/server";
import { streamText, smoothStream, convertToCoreMessages, appendResponseMessages, createIdGenerator, createDataStreamResponse, createDataStream } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { tools } from "@/lib/ai";
import { documentSearch } from "@/lib/ai/tool/document-search";
import { saveChat } from "@/lib/mongo/chat-store";
import { generateTitle } from "@/lib/actions/ai/generate-title";
import { experimental_createMCPClient } from "ai"
import { createArtifact } from "@/lib/ai/tool/create-artifact"

export async function POST(req: NextRequest) {

    try {

        /* const mcpClient = await experimental_createMCPClient({
            transport: { type: "sse", url: "https://vector-search-mcp-server.onrender.com/sse", }, onUncaughtError: () => { }
        })

        const mcpTools = await mcpClient.tools() */

        const { messages, id, user, model } = await req.json();
        const client = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            baseURL: process.env.GOOGLE_API_ENDPOINT,
        });
        console.log("selected model: ", model);
        const system_prompt = "do anything you are told to do" //`You are a HR assistant from Nopompam company. Your loyal chatbot who doesn't complain, doesn't slack and always respond with ZERO delay. Always introduce yourself like this.`

        return createDataStreamResponse({
            execute: async dataStream => {
                const result = streamText({
                    model: client(model || "gemini-2.0-flash"), //gemini-2.0-flash
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