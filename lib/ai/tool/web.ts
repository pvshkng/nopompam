import { tavily } from "@tavily/core"
import { z } from "zod";
import { DataStreamWriter, tool, generateId, smoothStream, streamText } from "ai";

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });


export const web = ({ }) => tool({
    description: "Search the web to find information to answer a question",
    inputSchema: z.object({
        query: z.string().describe('The query to search for which must also be rewritten for better context if necessary.'),
    }),
    execute: async ({ query }) => {
        try {
            const response = await tvly.search(
                query,
                {
                    includeImages: true,
                    includeImageDescriptions: true,
                    includeFavicon: true
                }
            );
            console.log("Tavily response: ", response);
            return response
        } catch (error) {
            console.error("Tavily error: ", error);
            return `Error while searching the web for query: ${query}`;
        }

    }
})