import { UIMessageStreamWriter, tool, smoothStream, streamText, convertToModelMessages } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { storeArtifact } from "@/lib/mongo/artifact-store"
import type UIMessage from 'ai';
// TODO: move sw else
const client = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: process.env.GOOGLE_API_ENDPOINT,
});
interface DocumentProps {
  threadId: string;
  user: any;
  messages: any[];
  writer: UIMessageStreamWriter;
}

export const document = ({ threadId, user, messages, writer }: DocumentProps) =>
  tool({
    description: "Create a text document and stream its content.",
    inputSchema: z.object({
      title: z.string().describe("The title of the artifact. If the title is not provided, it will be inferred from the prompt."),
      kind: z.enum(["text"]),
    }),
    execute: async ({ title, kind }, { toolCallId }) => {
      console.log("Initializing document tool")
      console.log(`message: ${messages}`)
      const id = toolCallId //generateId(8); 
      try {

        writer.write({
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
        });


        let draftContent = '';
        const { fullStream } = streamText({
          model: client("gemini-2.5-flash"),
          experimental_transform: smoothStream({ chunking: 'word' }),
          system: `
                  Write document about the given topic. 
                  Do not include anything other than the content of the document.

                  Use markdown to format the content. 
                  For example:
                  - use headings to define sections
                  - use horizontal rules to split sections
                  - use tables for comparison
                  - use bullet points for entries, etc.
                  `,

          messages: [...messages, { role: "user", content: `Write a document about ${title}.` }],
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
