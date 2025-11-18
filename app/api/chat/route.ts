import { NextRequest } from "next/server";
import { streamText, smoothStream, convertToModelMessages, stepCountIs, createUIMessageStream, generateId, createUIMessageStreamResponse } from "ai";
import { saveChat } from "@/lib/mongo/chat-store";
import { generateTitle } from "@/lib/actions/ai/generate-title";

import { contructSystemPrompt } from "@/lib/prompt/system";
import { getProvider } from "@/lib/ai/provider"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import { web } from "@/lib/ai/tool/web";
import { document } from "@/lib/ai/tool/document"
import { search } from "@/lib/ai/tool/search";
import { chart } from "@/lib/ai/tool/chart";
import { createText } from "@/lib/ai/tool/document-create-text";
import { createSheet } from "@/lib/ai/tool/document-create-sheet";
import { createPython } from "@/lib/ai/tool/document-create-python";
import { createMrm } from "@/lib/ai/tool/document-create-mrm";
import { createSql } from "@/lib/ai/tool/document-create-sql";
import { mock } from "./mock";

import { getMemoryBankMCPClient } from "@/lib/mcp";
import { constructMemory } from "@/lib/prompt/memory"
import { m } from "motion/react";

export const maxDuration = 60;

export async function POST(req: NextRequest) {

    try {
        let memory: any[] = []
        const { messages, id, model } = await req.json();
        const modelMessages = convertToModelMessages(messages)

        const session = await auth.api.getSession({
            headers: await headers(),
        });
        const user = session?.user?.email
        /* if (!session) {
            const result = await mock();
            return result
        } */

        let memoryResource = null;
        let memoryTools = {};
        let bank = null;
        if (user) {
            try {
                bank = await getMemoryBankMCPClient(user);
                if (bank) {
                    [memoryResource, memoryTools] = await Promise.all([
                        bank.readResource({ uri: "resource://memory.recall" }),
                        bank.tools()
                    ]);
                }
            } catch (error) {
                console.error("Error fetching memory:", error);
            }
        }

        const memoryString = constructMemory(memoryResource || null)
        const provider = getProvider(model);
        const instruction = contructSystemPrompt(memoryString)
        const stream = createUIMessageStream({
            // originalMessages: messages,
            execute: ({ writer }) => {
                const artifactProps = { threadId: id, user: user, getMemory: () => memory, writer: writer }
                try {
                    const result = streamText({
                        model: typeof provider === "string" ? provider : provider(model),
                        system: instruction,
                        prompt: modelMessages,
                        tools: {
                            // web: web({}),
                            createText: createText(artifactProps),
                            createSheet: createSheet(artifactProps),
                            createPython: createPython(artifactProps),
                            createMrm: createMrm(artifactProps),
                            createSql: createSql(artifactProps),
                            search: search({ writer }),
                            chart: chart(),
                            ...(memoryTools || {})

                            // web: web({ writer }),
                            // document: document({ threadId: id, user: user, getMemory: () => memory, writer: writer }),
                            // code_execution: google.tools.codeExecution({}),
                            // google_search: google.tools.googleSearch({}),
                            // url_context: google.tools.urlContext({}),


                        },
                        stopWhen: stepCountIs(5),
                        onError(error) {
                            console.error("Error in chat route: ", error);
                        },
                        prepareStep: async ({ model, stepNumber, steps, messages }) => {
                            memory = messages
                            return { messages: messages }
                        },
                        experimental_transform: smoothStream({
                            chunking: 'word',
                            delayInMs: 10
                        })
                    });

                    writer.merge(result.toUIMessageStream({
                        generateMessageId: () => generateId(),
                        onFinish: async ({ messages: _messages }) => {
                            try {
                                let title = undefined;
                                if (messages.length === 1) {
                                    title = await generateTitle(messages) || "New Chat";
                                    writer.write({
                                        type: 'data-title',
                                        data: { title: title }
                                    });
                                }
                                if (user) {
                                    saveChat({
                                        _id: id,
                                        title: title,
                                        user: user,
                                        messages: [...messages, ..._messages]
                                    });
                                } else {
                                    console.log("No user found, skipping saveChat");
                                }
                                //bank?.close()
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