import { UIMessageStreamWriter, tool, smoothStream, streamText, convertToModelMessages } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { storeArtifact } from "@/lib/mongo/artifact-store"
import type { UIMessage, ModelMessage } from 'ai';
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
      const prompt = `
                  Content:
                  ${JSON.stringify(memory, null, 2)}

                  Write a document about ${title}.
                  `
      console.log("Document prompt: ", prompt);
      const id = toolCallId //generateId(8); 
      try {

        /* writer.write({
          type: 'data-document',
          data: { id: id, type: "kind", content: kind }
        });
        writer.write({
          type: 'data-document',
          data: { id: id, type: "id", content: toolCallId }
        });
        writer.write({
          type: 'data-document',
          data: { id: id, type: "title", content: title }
        });
        writer.write({
          type: 'data-document',
          data: { id: id, type: "clear", content: "" }
        }); */


        let draftContent = '';
        const { fullStream } = streamText({
          model: client("gemini-2.5-flash"),
          // experimental_transform: smoothStream({ chunking: "word" }),
          system: `
                  Write document about the given topic. 
                  Do not include anything other than the content of the document.

                  Use **HTML** to format the content. 
                  For example:
                  - use headings to define sections
                  - use horizontal rules to split sections
                  - use tables for comparison
                  - use bullet points for entries, etc.
                  - include images if provided and relevant.
                  - DO NOT MAKE UP IMAGES, only use images that are provided.
                  - ALWAYS include references to sources at the end if available.

                  HTML MUST BE VALID and well-formed.
                  DO NOT INCLUDE BACKTICKS OR MARKDOWN SYNTAX.
                  `,

          prompt: prompt,
          onFinish: async ({ response },) => {
            // draftContent
            await storeArtifact({
              artifactId: id,
              threadId: threadId,
              user: user,
              kind: kind,
              title: title,
              content: draftContent,
            });
          },
          onError: (error) => console.error("Error during artifact creation: ", error),
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
        return error
      }
    },
  });
