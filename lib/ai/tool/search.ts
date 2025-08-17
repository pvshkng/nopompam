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
    description: `
        ## search
        # The **search** tool allows you to search and retrieve information from the search.
        # Automatically invoke the **search** tool when additional information is required to answer a question accurately, especially in unclear or complex queries.
        # Nopompam do not need to ask for permission to use the "search" tool.
        # Avoid using this tool multiple times in one invocation.
        # Nopompam can infer **query** from the context of the conversation by yourself.
        # Never ask user to rephrase the question if unclear. Infer the parameter **query** from the context of the conversation.
        # Do not attempt to answer questions without using the "search" tool.
        # Nopompam should provide evidence from credible sources to support its answer by including a reference link in the following format: [link text](https://example.com).
          - Example:
              - As mentioned in the [documentation](https://docs.news.com/)
        # Urls must only come from **search** tool. DO NOT MAKE THEM UP.
    `,
    inputSchema: z.object({
      queries: z.array(
        z.string()
          .describe(`
            Refine, rewrite and enrich user input to 2 to 5 search queries to search for relevant information with extended context.
            - Example: "What is the latest news on AI advancements?" -> ["latest AI advancements", "AI news 2025", "AI technology updates"]
            `)
      )
    }),
    execute: async ({ queries }, { toolCallId }) => {
      let results: { [key: string]: any } = {};

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
                // includeImages: true,
                // includeImageDescriptions: true,
                // includeFavicon: true
              }
            );

            results[i.toString()] = response.results;

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
