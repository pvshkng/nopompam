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

export const createArtifact = ({ threadId, user, dataStream }: CreateArtifactProps) =>
  tool({
    description: "Create a text artifact and stream its content.",
    parameters: z.object({
      title: z.string(),
      kind: z.enum(["text"]),
    }),
    execute: async ({ title, kind }, { toolCallId }) => {
      const id = toolCallId //generateId(8); 

      dataStream.writeData({ type: "kind", content: kind });
      dataStream.writeData({ type: "id", content: toolCallId });
      dataStream.writeData({ type: "title", content: title });
      dataStream.writeData({ type: "clear", content: "" });

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
      let draftContent = '';
      const { fullStream } = streamText({
        model: client("gemini-2.0-flash"),
        system:
          'Write about the given topic. Markdown is supported. Use headings wherever appropriate.',
        experimental_transform: smoothStream({ chunking: 'word' }),
        prompt: title,
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
        }
      });

      for await (const delta of fullStream) {
        const { type } = delta;

        if (type === 'text-delta') {
          const { textDelta } = delta;

          draftContent += textDelta;

          dataStream.writeData({
            id: id,
            type: 'text-delta',
            content: textDelta,
          });
        }
      }

      return {
        id,
        title,
        kind,
        content: "A document was created and is now visible to the user.",
      };
    },
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