import { streamObject } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { storeArtifact } from "@/lib/mongo/artifact-store";
import { z } from "zod";
import type { ModelMessage } from "ai";
import type { DocumentHandler } from "./types";

const client = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  baseURL: process.env.GOOGLE_API_ENDPOINT,
});

export const sheetHandler: DocumentHandler = async ({
  id,
  title,
  kind,
  threadId,
  user,
  getMemory,
  writer,
}) => {
  const memory = getMemory();
  const cleanedMessages = memory.map((message) => {
    if (message.role === "tool") {
      return {
        role: "tool",
        content: message.content.map((content) => ({
          type: "tool-result",
          toolCallId: content.toolCallId,
          toolName: content.toolName,
          output: {
            type: "text",
            value: JSON.stringify(content.output.value),
          },
        })),
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
        Generate a spreadsheet about the given topic in CSV format.
        
        Guidelines:
        - First row should contain column headers
        - Subsequent rows contain the data
        - Use comma as delimiter
        - Keep data concise and relevant
        - Use realistic and accurate values
        
        Example:
        Recipe Name,Cuisine,Prep Time
        Lasagna,Italian,30
        Tikka Masala,Indian,20
        </instructions>

        Now generate a spreadsheet about: ${title}
        `,
    },
  ] as ModelMessage[];

  const spreadsheetSchema = z.object({
    csv: z.string().describe("CSV formatted data with headers in the first row"),
  });

  writer.write({
    type: "data-document",
    data: {
      id: id,
      type: "init",
      content: {
        id,
        title,
        kind,
      },
    },
  });

  writer.write({
    type: "data-document",
    data: {
      id: id,
      type: "start",
      content: "",
    },
  });

  let draftContent = "";

  try {
    const { fullStream } = streamObject({
      model: client("gemini-2.5-flash"),
      schema: spreadsheetSchema,
      messages: prompt,
      onError: (error) => {
        console.error("Error during sheet creation: ", error);
        writer.write({
          type: "data-document",
          data: {
            id: id,
            type: "error",
            content: error,
          },
        });
      },
    });

    for await (const delta of fullStream) {
      const { type } = delta;

      if (type === "object") {
        const { object } = delta;
        const { csv } = object;
        
        if (csv) {
          writer.write({
            type: "data-document",
            data: {
              id: id,
              type: "text",
              content: csv,
            },
          });
          draftContent = csv;
        }
      }
    }

    writer.write({
      type: "data-document",
      data: {
        id: id,
        type: "stop",
        content: "",
      },
    });

    await storeArtifact({
      artifactId: id,
      threadId: threadId,
      user: user,
      kind: kind,
      title: title,
      content: draftContent,
    });

    return {
      id,
      title,
      kind,
      content: draftContent,
    };
  } catch (error) {
    console.error("Error during sheet creation: ", error);
    writer.write({
      type: "data-document",
      data: {
        id: id,
        type: "error",
        content: error,
      },
    });
    throw error;
  }
};