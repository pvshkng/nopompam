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

export const search = ({ writer }: SearchProps) =>
  tool({
    description: "Search for relevant information and use the results for further processing.",
    inputSchema: z.object({
      queries: z.array(
        z.string()
          .describe("Refine, rewrite and enrich user input to 2 to 5 search queries to search for relevant information with extended context.")
      )
    }),
    execute: async ({ queries }, { toolCallId }) => {
      let results: { [key: number]: any } = {};
      
      // Initialize draft tool in store
      writer.write({
        type: 'data-tool-search',
        data: {
          type: 'init',
          toolCallId,
          toolType: 'search',
          queries,
        }
      });

      try {
        for (let i = 0; i < queries.length; i++) {
          try {
            const response = await tvly.search(
              queries[i],
              {
                includeImages: true,
                includeImageDescriptions: true,
                includeFavicon: true
              }
            );

            results[i] = response.results;
            
            writer.write({
              type: 'data-tool-search',
              data: {
                type: 'query-complete',
                toolCallId,
                queryId: i,
                status: "complete",
                result: response.results
              }
            });
          } catch (error) {
            writer.write({
              type: 'data-tool-search',
              data: {
                type: 'query-error',
                toolCallId,
                queryId: i,
                status: "error",
              }
            });
            console.error(`Error while searching query id ${i} with error: ${error}`);
          }
        }

        // Finalize tool
        writer.write({
          type: 'data-tool-search',
          data: {
            type: 'finalize',
            toolCallId,
            output: results
          }
        });

      } catch (error) {
        console.error("Error during search execution: ", error);
        return { error: "Search execution failed." };
      }
      
      return results;
    },
  });
