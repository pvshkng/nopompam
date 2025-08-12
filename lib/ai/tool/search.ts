import { UIMessageStreamWriter, tool, smoothStream, streamText, convertToModelMessages } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { storeArtifact } from "@/lib/mongo/artifact-store"
import type { UIMessage, ModelMessage } from 'ai';
import { tavily } from "@tavily/core"

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY! });

// TODO: move sw else
const client = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: process.env.GOOGLE_API_ENDPOINT,
});
interface DocumentProps {
  threadId: string;
  user: any;
  getMemory: () => ModelMessage[];
  writer: UIMessageStreamWriter;
}

const minBreadth = 1;
const maxBreadth = 10;

export const search = ({ threadId, user, getMemory, writer }: DocumentProps) =>
  tool({
    description: "Search for relevant information and use the results for further processing.",
    inputSchema:
      z.object({
        queries:
          z.array(
            z.string()
              .min(minBreadth)
              .max(maxBreadth)
              .describe("Queries refined, rewritten and enriched from user input to search for relevant information with extended context.")
          )
      })

    ,
    execute: async ({ queries }, { toolCallId }) => {
      let results = [];
      try {
        for (const q of queries) {
          const response = await tvly.search(
            q,
            {
              includeImages: true,
              includeImageDescriptions: true,
              includeFavicon: true
            }
          );
          results.push(...response.results);
        }
      } catch (error) {
        console.error("Error during search execution: ", error);
        return { error: "Search execution failed." };
      }
      return {}
    },
  });
