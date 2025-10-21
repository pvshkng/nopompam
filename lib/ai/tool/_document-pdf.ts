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

export const pdfHandler: DocumentHandler = async ({
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
        Generate a PDF artifact about the given topic.
        - If a PDF is available in context, use its URL.
        - Otherwise, generate a plausible placeholder URL (e.g., "/pdfs/${title}.pdf").
        - Optionally, suggest highlight regions as an array of { page: number, rect: { x, y, width, height } }.
        - Return as JSON: { url: string, highlights: Highlight[] }
        - Do not include markdown, only JSON.
        - Do not wrap output in backticks or code blocks.
        </instructions>

        Now generate a PDF artifact about: ${title}
      `,
    },
  ] as ModelMessage[];

  const pdfSchema = z.object({
    url: z.string().describe("URL or path to the PDF file"),
    highlights: z
      .array(
        z.object({
          page: z.number(),
          rect: z.object({
            x: z.number(),
            y: z.number(),
            width: z.number(),
            height: z.number(),
          }),
        })
      )
      .describe("Array of highlight regions"),
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
      schema: pdfSchema,
      messages: prompt,
      onError: (error) => {
        console.error("Error during PDF creation: ", error);
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
        const content = JSON.stringify(object);
        writer.write({
          type: "data-document",
          data: {
            id: id,
            type: "text",
            content,
          },
        });
        draftContent = content;
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
    console.error("Error during PDF creation: ", error);
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
