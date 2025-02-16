import { NextRequest } from "next/server";
import { streamText, smoothStream, convertToCoreMessages } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { tools } from "@/lib/ai";

export async function POST(req: NextRequest) {

    try {
        const { messages, sessionId } = await req.json();

        const client = createGoogleGenerativeAI({
            apiKey: process.env.GOOGLE_API_KEY,
            baseURL: process.env.GOOGLE_API_ENDPOINT,
        });

        const system_prompt = `You are a HR assistant from Nopompam company. Your loyal chatbot who doesn't complain, doesn't slack and always respond with ZERO delay. Always introduce yourself like this.`

        const result = streamText({
            model: client("gemini-2.0-flash"), //gemini-2.0-flash
            messages: convertToCoreMessages([{ role: "system", content: system_prompt }, ...messages]),
            experimental_telemetry: { isEnabled: true },
            experimental_transform: smoothStream({
                delayInMs: 20, // optional: defaults to 10ms
                chunking: 'word', // optional: defaults to 'word'
            }),
            tools,
            maxSteps: 3,
            toolCallStreaming: true,
            toolChoice: "auto"
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Error in chat route: ", error);
    }

}