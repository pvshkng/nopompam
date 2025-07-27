import { DataStreamWriter, tool, generateId, smoothStream, streamText, convertToCoreMessages } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { storeArtifact } from "@/lib/mongo/artifact-store"
import type UIMessage from "@ai-sdk/ui-utils";
// TODO: move sw else
const client = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: process.env.GOOGLE_API_ENDPOINT,
});
interface CreateArtifactProps {
  threadId: string;
  user: any;
  messages: any[];
  dataStream: DataStreamWriter;
}

export const createArtifact = ({ threadId, user, messages, dataStream }: CreateArtifactProps) =>
  tool({
    description: "Create a text artifact and stream its content.",
    parameters: z.object({
      title: z.string().describe("The title of the artifact. If the title is not provided, it will be inferred from the prompt."),
      kind: z.enum(["text"]),
    }),
    execute: async ({ title, kind }, { toolCallId }) => {
      const id = toolCallId //generateId(8); 

      dataStream.writeData({ id: id, type: "kind", content: kind });
      dataStream.writeData({ id: id, type: "id", content: toolCallId });
      dataStream.writeData({ id: id, type: "title", content: title });
      dataStream.writeData({ id: id, type: "clear", content: "" });

      let draftContent = '';
      const { fullStream } = streamText({
        model: client("gemini-2.5-pro"),
        experimental_transform: smoothStream({ chunking: 'word' }),
        messages: convertToCoreMessages([{
          role: "system",
          content: `
                  Write document about the given topic. 
                  Do not include anything other than the content of the document.

                  Use markdown to format the content. 
                  For example:
                  - use headings to define sections
                  - use horizontal rules to split sections
                  - use tables for comparison
                  - use bullet points for entries, etc.
                  ` },
        ...messages,
        {
          role: "user",
          content: `Generate a document with the title: ${title}`,
        }]),
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