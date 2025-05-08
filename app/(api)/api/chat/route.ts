import { NextRequest } from "next/server";
import { streamText, smoothStream, convertToCoreMessages, appendResponseMessages, createIdGenerator, createDataStreamResponse, type DataStreamWriter } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { StateGraph } from "@langchain/langgraph";
import { tools } from "@/lib/ai";
import { saveChat } from "@/lib/ai/chat-store";

const system_prompt = "do anything you are told to do";



type StreamState = {
    id: string,
    user: string;
    messages: any[];
    dataStream: DataStreamWriter;
};

async function invokeAgent(state: StreamState): Promise<StreamState> {
    const { _id, user, messages, dataStream, } = state;
    console.log("invokeAgent state: ", state);
    const client = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
        baseURL: process.env.GOOGLE_API_ENDPOINT,
    });
    const result = streamText({
        model: client("gemini-2.0-flash"), //gemini-2.0-flash
        messages: convertToCoreMessages([...messages]),
        tools,
        maxSteps: 3,
        experimental_generateMessageId: createIdGenerator({
            prefix: 'msgs',
            size: 16,
        }),
        async onFinish({ response }) {
            saveChat({
                _id: _id,
                user: user,
                messages: appendResponseMessages({
                    messages,
                    responseMessages: response.messages,
                }),
            });
        },
    })

    await result.mergeIntoDataStream(dataStream, {
        experimental_sendStart: true,
        experimental_sendFinish: true
    })

    //dataStream.write(`0:"\\n---\\n"\n`);
    messages.push(...(await result.response).messages);
    //dataStream.write(`0:"${resultResponse}"\n`);

    return { messages, dataStream };

}

function createGraph() {
    const workflow = new StateGraph<StreamState>({
        channels: {
            _id: undefined,
            user: undefined,
            messages: { value: [] },
            dataStream: { value: null }
        }
    })
        .addNode("agent", invokeAgent)
        .addEdge("__start__", "agent")
        .addEdge("agent", "__end__");
    return workflow.compile();
}

const graph = createGraph();

export async function POST(req: NextRequest) {
    try {
        const { messages, id, user } = await req.json();

        return createDataStreamResponse({
            execute: async dataStream => {
                await graph.invoke({
                    _id: id,
                    user: user,
                    messages: messages,
                    dataStream: dataStream
                });

            }
        });
    } catch (error) {
        console.error("Error in chat route: ", error);
        return new Response(JSON.stringify({ error: "An error occurred" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}