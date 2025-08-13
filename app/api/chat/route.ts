import { NextRequest } from "next/server";
import { streamText, smoothStream, convertToModelMessages, stepCountIs, hasToolCall, createUIMessageStream, generateId, createUIMessageStreamResponse } from "ai";
import { web } from "@/lib/ai/tool/web";
import { document } from "@/lib/ai/tool/document"
import { search } from "@/lib/ai/tool/search";

import { saveChat } from "@/lib/mongo/chat-store";
import { generateTitle } from "@/lib/actions/ai/generate-title";
import { experimental_createMCPClient } from "ai"

import { mock } from "@/app/api/chat/mock";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { system_prompt } from "./system";
import { getProvider } from "./provider";
import { m } from "motion/react";
export const maxDuration = 60;

export async function POST(req: NextRequest) {

    try {
        const { messages, id, user, model, session } = await req.json();
        const modelMessages = convertToModelMessages(messages, { ignoreIncompleteToolCalls: true })
        if (!session) {
            const result = await mock();
            return result
        }
        let memory = []
        const provider = getProvider(model);
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
                            // web: web({}),
                            search: search({ writer }),
                            // document: document({ threadId: id, user: user, getMemory: () => messages, writer: writer }),
                        },

                        stopWhen: stepCountIs(5),
                        onError(error) {
                            console.error("Error in chat route: ", error);
                        },
                        /* prepareStep: async ({ model, stepNumber, steps, messages }) => {
                            memory = messages
                            return {
                                memory: memory,
                                messages: messages.length > 20 ? messages.slice(-10) : messages,
                            };
                        } */

                    });

                    writer.merge(result.toUIMessageStream({
                        generateMessageId: () => generateId(),
                        onFinish: async ({ responseMessage, messages: _messages }) => {
                            try {
                                let title = undefined;
                                if (messages.length === 1) {
                                    title = await generateTitle(messages) || "New Chat";
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

            },
        });

        return createUIMessageStreamResponse({ stream })

    } catch (error) {
        console.error("Error in chat route: ", error);
        throw error
    }

}