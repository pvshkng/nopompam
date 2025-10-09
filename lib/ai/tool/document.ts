import { UIMessageStreamWriter, tool, smoothStream, streamText, convertToModelMessages, convertToCoreMessages } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { storeArtifact } from "@/lib/mongo/artifact-store"
import type { UIMessage, ModelMessage } from 'ai';
import { removeProviderExecuted } from "@/lib/ai/utils";

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

export const document = ({ threadId, user, getMemory, writer }: DocumentProps) =>
  tool({
    description: `
    ## document
    # The "document" tool creates and updates text documents that render to the user on a space next to the conversation (referred to as the "dossier").
    # Use this tool when asked to work on writing that's long enough like article / essay.
    # Only invoke this tool once for each document you want to create.
    # DO NOT REPEAT THE CONTENT OF THIS TOOL SINCE IT'S ALREADY IN THE UI.
    `,
    inputSchema: z.object({
      title: z.string().describe("The title of the artifact. If the title is not provided, it will be inferred from the prompt."),
      kind: z.enum(["text"]),
    }),
    execute: async ({ title, kind }, { toolCallId }) => {
      const memory = getMemory();
      const cleanedMessages = memory.map(message => {
        if (message.role === 'tool') {
          return {
            role: 'tool',
            content: message.content.map(content => ({
              type: 'tool-result',
              toolCallId: content.toolCallId,
              toolName: content.toolName,
              output: {
                type: "text",
                value: JSON.stringify(content.output.value)
              }
            }))
          };
        }
        return message;
      });

      const prompt = [
        ...cleanedMessages,
        {
          role: "user",
          content: `
          <instructions>
          Write document about the given topic. 
          The content will be rendered in Tiptap editor, so format it accordingly.
          Do not include anything other than the content of the document.

          Use **HTML** to format the content. 
          For example:
          - USE tables for comparison or data presentation regardless of quality or quantity of data
          - USE headings to define sections
          - USE horizontal rules to split sections
          - USE bullet points for entries, etc.
          - INCLUDE relevant images if provided in the context, chat history or other sources.
          - DO NOT MAKE UP IMAGES, only use images that are provided.
          - ALWAYS include references to sources with href at the end if available.

          HTML MUST BE VALID and well-formed.

          Prohibitions:
          - DO NOT WRAP THE OUTPUT IN \`\`\`html \`\`\`
          - DO NOT INCLUDE <html> tag, just output the content
          - DO NOT LEAVE TRAILING EMPTY BULLET POINTS
          - DO NOT INCLUDE BACKTICKS OR MARKDOWN SYNTAX.
          </instructions>

          Now write a document about the following topic:
          ${title}
          ` }] as ModelMessage[];

      const id = toolCallId;
      try {
        // Send document initialization
        writer.write({
          type: 'data-document',
          data: {
            id: id,
            type: "init",
            content: {
              id,
              title,
              kind
            }
          }
        });

        // Send start streaming signal
        writer.write({
          type: 'data-document',
          data: {
            id: id,
            type: "start",
            content: ""
          }
        });

        let draftContent = '';
        const { fullStream } = streamText({
          model: client("gemini-2.5-flash"),
          messages: prompt,
          onFinish: async ({ response }) => {
            // Send stop streaming signal
            writer.write({
              type: 'data-document',
              data: {
                id: id,
                type: "stop",
                content: ""
              }
            });

            await storeArtifact({
              artifactId: id,
              threadId: threadId,
              user: user,
              kind: kind,
              title: title,
              content: draftContent,
            });
          },
          onError: (error) => {
            console.error("Error during artifact creation: ", error);
            // Send error signal
            writer.write({
              type: 'data-document',
              data: {
                id: id,
                type: "error",
                content: error
              }
            });
          },
        });

        for await (const delta of fullStream) {
          const { type } = delta;

          if (type === 'text-delta') {
            const { text } = delta;
            draftContent += text;

            writer.write({
              type: 'data-document',
              data: {
                id: id,
                type: 'text',
                content: text,
              }
            });
          }
        }

        return {
          id,
          title,
          kind,
          content: draftContent,
        };
      } catch (error) {
        console.error("Error during artifact creation: ", error);
        writer.write({
          type: 'data-document',
          data: {
            id: id,
            type: "error",
            content: error
          }
        });
        return error;
      }
    },
  });
