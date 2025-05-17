import { NextRequest } from "next/server";
import { streamText, smoothStream, convertToCoreMessages, appendResponseMessages, createIdGenerator, createDataStreamResponse, createDataStream } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { tools } from "@/lib/ai";
import { saveChat } from "@/lib/ai/chat-store";
import { generateTitle } from "@/lib/actions/ai/generate-title";

export async function POST(req: NextRequest) {

    try {
        const { messages, id, user } = await req.json();

        const client = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            baseURL: process.env.GOOGLE_API_ENDPOINT,
        });

        const system_prompt = "do anything you are told to do" //`You are a HR assistant from Nopompam company. Your loyal chatbot who doesn't complain, doesn't slack and always respond with ZERO delay. Always introduce yourself like this.`

        return createDataStreamResponse({
            execute: async dataStream => {
                const result = streamText({
                    model: client("gemini-2.0-flash"), //gemini-2.0-flash
                    messages: convertToCoreMessages([{ role: "system", content: system_prompt }, ...messages]),

                    experimental_telemetry: { isEnabled: true },
                    experimental_transform: smoothStream({
                        delayInMs: 20, // optional: defaults to 10ms
                        chunking: 'word', // optional: defaults to 'word'
                    }),
                    //tools,
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
                        const title = await generateTitle(messages[0].content);
                        dataStream.writeMessageAnnotation({ title: title });
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
    }

}