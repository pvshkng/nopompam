import { NextRequest } from "next/server";
import { streamText, smoothStream, convertToCoreMessages, appendResponseMessages, createIdGenerator, createDataStreamResponse, createDataStream } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from '@ai-sdk/openai';
import { createMistral } from '@ai-sdk/mistral';

import { tools } from "@/lib/ai";
import { documentSearch } from "@/lib/ai/tool/document-search";
import { createArtifact } from "@/lib/ai/tool/create-artifact"
import { web } from "@/lib/ai/tool/web";
import { stock } from "@/lib/ai/tool/stock";

import { saveChat } from "@/lib/mongo/chat-store";
import { generateTitle } from "@/lib/actions/ai/generate-title";
import { experimental_createMCPClient } from "ai"

import { mock } from "@/app/api/chat/mock";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const maxDuration = 60;

export async function POST(req: NextRequest) {

    try {

        /* const mcpClient = await experimental_createMCPClient({
            transport: { type: "sse", url: "https://vector-search-mcp-server.onrender.com/sse", }, onUncaughtError: () => { }
        })

        const mcpTools = await mcpClient.tools() */
        const { messages, id, user, model, session } = await req.json();

        if (!session) {
            const result = await mock();
            return result.toDataStreamResponse({})
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
        Nopompam does not support LaTax. Avoid using LaTex.

        ## web
        # The **web** tool allows you to search and retrieve information from the web.
        # Automatically invoke the **web** tool when additional information is required to answer a question accurately, especially in unclear or complex queries.
        # Nopompam do not need to ask for permission to use the "web" tool.
        # Nopompam can infer **query** from the context of the conversation by yourself.
        # Never ask user to rephrase the question if unclear. Infer the parameter **query** from the context of the conversation.
        # Do not attempt to answer questions without using the "web" tool.
        # Nopompam should provide evidence from credible sources to support its answer by including a reference link in the following format: [link text](https://example.com).
          - Example:
              - As mentioned in the [documentation](https://docs.news.com/)
        # Urls must only come from **web** tool. DO NOT MAKE THEM UP.
        # Nopompam may include images in its responses in Markdown format should the image is relevant to the context of the conversation.
          - Example:
              - ![Tux, the Linux mascot](https://example.com/image.jpg)
        
        ## stock
        # The **stock** tool allows you to retrieve stock price of a company and render as a chart on UI.
        # Invoke the **stock** tool when asked to retrieve stock price of a company.
        # Nopompam does not need to ask for permission to use the "stock" tool.
        # Nopompam does not need to repeat the entire stock data to user as it's already in the UI.
        # Nopompam may give the latest price in a table format as summary.

        ## createArtifact
        # The "createArtifact" tool creates and updates text documents that render to the user on a space next to the conversation (referred to as the "dossier").
        # Use this tool when asked to work on writing that's long enough like article / essay.
        # Only invoke this tool once for each document you want to create.
        # Only invoke this tool after **web** tool to get more context.

        ### Special tags
        Nopompam has access to special tags for displaying rich UI content to the user
        When you need to present interactive elements, you must wrap it within any of these tags.

        ## <tldr>
        - If Nopompam generates any response longer than 2 paragraphs, You MUST include a summary within <tldr> tags.
        - The summary must:
          * Capture only the key points
          * Be limited to 2-3 sentences
          * Use plain text only (no markdown)
          * Follow this exact format:
            <tldr>Key point 1. Key point 2. Key point 3.</tldr>
        - Example: 
            [Your detailed response here...]

            <tldr>{your_summary_here}</tldr>
        - Never skip this requirement for long responses

        `

        return createDataStreamResponse({
            execute: async dataStream => {
                const result = streamText({
                    model: provider(model),
                    messages: convertToCoreMessages([{ role: "system", content: system_prompt }, ...messages]),
                    experimental_telemetry: { isEnabled: true },
                    // experimental_transform: smoothStream({
                    //     delayInMs: 20, // optional: defaults to 10ms
                    //     chunking: 'word', // optional: defaults to 'word'
                    // }),
                    // ...tools, 
                    // documentSearch
                    tools: {
                        createArtifact: createArtifact({ threadId: id, user: user, messages: messages, dataStream: dataStream }),
                        web: web({}),
                        stock: stock({})
                    },
                    maxSteps: 5,
                    toolCallStreaming: true,
                    // toolChoice: "auto",


                    experimental_generateMessageId: createIdGenerator({
                        prefix: 'msgs',
                        size: 16,
                    }),

                    //save chat
                    async onFinish({ response }) {
                        try {
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
                        } catch (error) {
                            console.error("Error creating chat: ", error);
                        }
                    },
                    onError(error) {
                        console.error("Error in chat route: ", error);
                        //dataStream.writeMessageAnnotation({ error: error.message });
                    }

                });

                await result.mergeIntoDataStream(dataStream, {
                    //experimental_sendStart: true,
                    //experimental_sendFinish: true
                })
            }
        })

    } catch (error) {
        console.error("Error in chat route: ", error);
        throw error
    }

}