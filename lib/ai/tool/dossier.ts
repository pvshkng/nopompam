import { DataStreamWriter, tool, generateId, smoothStream, streamText } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { storeArtifact } from "@/lib/mongo/artifact-store"

// TODO: move sw else
const client = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: process.env.GOOGLE_API_ENDPOINT,
});
interface CreateArtifactProps {
  threadId: string;
  user: any;
  dataStream: DataStreamWriter;
}

export const dossier = ({ threadId, user, dataStream }: CreateArtifactProps) =>
  tool({
    description: "Handle operations like creating, viewing and updating documents in the dossier .",
    inputSchema: z.discriminatedUnion("action", [
      z.object({
        action: z.literal("create"),
        title: z.string().describe("Title of the document, if not provided, infer from the prompt."),
        kind: z.enum(["document"]),
      }),
      z.object({
        action: z.literal("view"),
        id: z.string().describe("ID of the document to view."),
      }),
      z.object({
        action: z.literal("update"),
        id: z.string().describe("ID of the document to update."),
        content: z.string().describe("Content to update the document with."),
      })
    ]),

    execute: async (params, { toolCallId }) => {
      const { action } = params;
      //generateId(8); 

      // dataStream.writeData({ type: "kind", content: kind });
      // dataStream.writeData({ type: "id", content: toolCallId });
      // dataStream.writeData({ type: "title", content: title });
      // dataStream.writeData({ type: "clear", content: "" });

      /* // Stream content as text-delta
      const contentChunks = [
        //`# ${title}\n\n`,
        "This is the first paragraph.\n\n",
        "This is the second paragraph.\n\n",
        "This is the third paragraph.\n\n",
      ];
      for (const chunk of contentChunks) {
        dataStream.writeData({ type: "text-delta", content: chunk, id });
        await new Promise((r) => setTimeout(r, 300));
      }
  
      dataStream.writeData({ type: "finish", content: "" }); */

      switch (action) {
        case "create":
          const id = toolCallId
          let draftContent = '';
          const { fullStream } = streamText({
            model: client("gemini-2.0-flash"),
            system:
              'Write about the given topic. Markdown is supported. Use headings wherever appropriate.',
            experimental_transform: smoothStream({ chunking: 'word' }),
            prompt: "title",
            onFinish: async ({ response },) => {
              // draftContent
              await storeArtifact({
                artifactId: id,
                threadId: threadId,
                user: user,
                kind: params.kind,
                title: params.title,
                content: draftContent,
              });
            }
          });

          for await (const delta of fullStream) {
            const { type } = delta;

            if (type === 'text') {
              const { textDelta } = delta;

              draftContent += textDelta;

              dataStream.write({
                'type': 'data',

                'value': [{
                  id: id,
                  type: 'text',
                  content: textDelta,
                }]
              });
            }
          }

          return {
            id,
            title,
            kind,
            content: "A document was created and is now visible to the user.",
          };
      }

      /* if (action === "create") {

      }
      else if (action === "view") {
      }
      else if (action === "update") {
      } */
    }
  });



// {type: 'kind', content: 'text'}
// {type: 'id', content: '1dOfgM3m'}
// {type: 'title', content: 'ungoobungoo'}
// {type: 'clear', content: ''}
// {type: 'text-delta', content: '# ungoobungoo\n\n', id: '1dOfgM3m'}
// {type: 'text-delta', content: 'This is the first paragraph.\n\n', id: '1dOfgM3m'}
// {type: 'text-delta', content: 'This is the second paragraph.\n\n', id: '1dOfgM3m'}
// {type: 'text-delta', content: 'This is the third paragraph.\n\n', id: '1dOfgM3m'}
// {type: 'finish', content: ''}