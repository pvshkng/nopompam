import { UIMessageStreamWriter, tool, smoothStream, streamText, convertToModelMessages } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { storeArtifact } from "@/lib/mongo/artifact-store"
import type { UIMessage, ModelMessage } from 'ai';
import { tavily } from "@tavily/core"

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

interface SearchProps {
    writer: UIMessageStreamWriter;
}

const minBreadth = 1;
const maxBreadth = 10;

export const memory = () => {

    return {
        "memory.remember": tool({
            description: "Use this tool to remember things about user so that you can recall them later.",
            inputSchema: z.object({
                memories: z.array(
                    z.string()
                        .describe("Sentences or a few words about the things to remember.")
                )
            }),
            execute: async ({ memories }, { toolCallId }) => { }
        }),
        "memory.recall": tool({
            description: "Use this tool to recall things about user.",
            inputSchema: z.object({}),
            execute: async ({ }, { toolCallId }) => { }
        }),
        "memory.forget": tool({
            description: "Use this tool to forget things about user.",
            inputSchema: z.object({
                memoryId: z.array(
                    z.string()
                        .describe("Id of the memory to forget.")
                )
            }),
            execute: async ({ memoryId }, { toolCallId }) => { }
        })
    }
}