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
  Generate a spreadsheet about the given topic.
  Create structured data in jspreadsheet format.
  
  Format:
  - data: 2D array where first column contains labels, subsequent columns contain values
  - columns: array of column configs with optional title and width (e.g., "300px", "200px")
  
  Example:
  {
    "data": [
      ["Metric", "Value"],
      ["Price", "$100"],
      ["Quantity", "50"]
    ],
    "columns": [
      {"title": "Description", "width": "300px"},
      {"title": "Amount", "width": "200px"}
    ]
  }
  
  Create meaningful data with proper column widths.
  </instructions>

  Now generate a spreadsheet about: ${title}
`,
    },
  ] as ModelMessage[];

  const spreadsheetSchema = z.object({
    data: z
      .array(z.array(z.string()))
      .describe('2D array of cell values, where each inner array is a row. First column often contains labels, subsequent columns contain values.'),
    columns: z
      .array(
        z.object({
          title: z.string().optional().describe('Column header title'),
          width: z.string().optional().describe('Column width like "300px" or "200px"'),
        })
      )
      .optional()
      .describe('Optional array of column configurations. Define width and title for each column.'),
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

  let finalContent = "";

  try {
    const { partialObjectStream, object } = streamObject({
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

    for await (const partialObject of partialObjectStream) {
      const streamData = {
        data: partialObject.data || [[]],
        columns: partialObject.columns || [],
      };

      const contentString = JSON.stringify(streamData);

      writer.write({
        type: "data-document",
        data: {
          id: id,
          type: "text",
          content: contentString,
        },
      });
    }

    const finalObject = await object;

    const finalData = {
      data: finalObject.data || [[]],
      columns: finalObject.columns || [],
    };

    finalContent = JSON.stringify(finalData);
    
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
      content: finalContent,
    });

    return {
      id,
      title,
      kind,
      content: finalContent,
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
