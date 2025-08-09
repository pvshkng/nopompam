import { NextRequest } from "next/server";
import { streamText, smoothStream, convertToModelMessages, stepCountIs, hasToolCall, createUIMessageStream, generateId, createUIMessageStreamResponse } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from '@ai-sdk/openai';
import { createMistral } from '@ai-sdk/mistral';

import { tools } from "@/lib/ai";
import { documentSearch } from "@/lib/ai/tool/document-search";
import { createArtifact } from "@/lib/ai/tool/create-artifact"
import { web } from "@/lib/ai/tool/web";
import { document } from "@/lib/ai/tool/document"
import { stock } from "@/lib/ai/tool/stock";

import { saveChat } from "@/lib/mongo/chat-store";
import { generateTitle } from "@/lib/actions/ai/generate-title";
import { experimental_createMCPClient } from "ai"

import { mock } from "@/app/api/chat/mock";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { system_prompt } from "./system";

export const maxDuration = 60;

export async function POST(req: NextRequest) {

    try {

        /* const mcpClient = await experimental_createMCPClient({
            transport: { type: "sse", url: "https://vector-search-mcp-server.onrender.com/sse", }, onUncaughtError: () => { }
        })

        const mcpTools = await mcpClient.tools() */
        const { messages, id, user, model, session } = await req.json();

        const modelMessages = convertToModelMessages(messages, { ignoreIncompleteToolCalls: true })
        if (!session) {
            const result = await mock();
            return result.toUIMessageStreamResponse({});
        }
        let provider
        switch (model) {
            case "ministral-3b-latest":
            case "ministral-8b-latest":
            case "mistral-large-latest":
            case "mistral-small-latest":
            case "pixtral-large-latest":
            case "pixtral-12b-2409":
            case "open-mistral-7b":
            case "open-mixtral-8x7b":
            case "open-mixtral-8x22b":
                provider = createMistral({
                    apiKey: process.env.MISTRAL_API_KEY,
                })
                break;

            case "moonshotai/kimi-k2:free":
            case "qwen/qwen3-coder:free":
            case "qwen/qwen3-235b-a22b:free":

            case "qwen/qwen3-30b-a3b:free":
            case "deepseek/deepseek-r1-0528:free":
            case "deepseek/deepseek-r1:free":
            case "deepseek/deepseek-chat-v3-0324:free":
            case "deepseek/deepseek-r1-0528-qwen3-8b:free":
            case "tngtech/deepseek-r1t2-chimera:free":
            case "cognitivecomputations/dolphin-mistral-24b-venice-edition:free":
                provider = createOpenAI({
                    apiKey: process.env.OPENROUTER_API_KEY,
                    baseURL: "https://openrouter.ai/api/v1"
                });
                break;

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

        /* try {
            const result = streamText({
                model: provider(model),
                system: system_prompt,
                messages: convertToModelMessages(messages),
                //experimental_telemetry: { isEnabled: true },
                // experimental_transform: smoothStream({
                tools: {
                    web: web({}),
                    // createArtifact: createArtifact({ threadId: id, user: user, messages: messages, writer: writer }),
                    // stock: stock({})
                },

                stopWhen: stepCountIs(5),
                onError(error) {
                    console.error("Error in chat route: ", error);
                }

            });

            return result.toUIMessageStreamResponse({});
        } catch (error) {
            console.error("Error: ", error);
        } */

        const stream = createUIMessageStream({
            // originalMessages: messages,
            execute: ({ writer }) => {

                try {
                    const result = streamText({
                        model: provider(model),
                        system: system_prompt,
                        messages: modelMessages,
                        //experimental_telemetry: { isEnabled: true },
                        experimental_transform: smoothStream({
                            chunking: 'word',
                            delayInMs: 10
                        }),
                        tools: {
                            web: web({}),
                            //document: document({ threadId: id, user: user, messages: convertToModelMessages(messages), writer: writer }),
                            // createArtifact: createArtifact({ threadId: id, user: user, messages: messages, writer: writer }),
                            // stock: stock({})
                        },

                        stopWhen: stepCountIs(5),
                        onError(error) {
                            console.error("Error in chat route: ", error);
                        }

                    });

                    writer.merge(result.toUIMessageStream({
                        generateMessageId: () => generateId(),
                        onFinish: async ({ responseMessage }) => {
                            try {
                                let title = undefined;
                                if (messages.length === 1) {
                                    title = await generateTitle(messages);
                                    writer.write({
                                        type: 'data-title',
                                        data: { title: title }
                                    });
                                }
                                saveChat({
                                    _id: id,
                                    title: title,
                                    user: user,
                                    messages: [...messages, responseMessage],
                                });
                            } catch (error) {
                                console.error("Error creating chat: ", error);
                            }
                        }
                    }));
                } catch (error) {
                    console.error("Error: ", error);
                }

            }
        });

        return createUIMessageStreamResponse({ stream })

    } catch (error) {
        console.error("Error in chat route: ", error);
        throw error
    }

}