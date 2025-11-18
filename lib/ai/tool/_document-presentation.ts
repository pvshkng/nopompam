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

const presentationSchema = z.object({
  pages: z.array(
    z.object({
      html: z.string().describe("HTML content for a single presentation page"),
    })
  ),
  currentPage: z.number().describe("Index of the current page"),
});

export const presentationHandler: DocumentHandler = async ({
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
        Generate a multi-page HTML presentation about the given topic.
        - Each page should be a valid HTML string for a 16:9 slide.
        - Use a color palette consistent with the rest of the project (Tailwind colors).
        - Do not include markdown, only HTML.
        - Do not wrap output in backticks or code blocks.
        - Stream the array of pages, updating as each page is ready.
        - Return as: { pages: [{ html }], currentPage: number }
        </instructions>

        Now generate a presentation about: ${title}
      `,
    },
  ] as ModelMessage[];

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

  let draftContent = {};

  try {
    const { fullStream } = streamObject({
      model: client("gemini-2.5-flash"),
      schema: presentationSchema,
      messages: prompt,
      onError: (error: unknown) => {
        console.error("Error during presentation creation: ", error);
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
      if (delta.type === "object") {
        const { object } = delta;
        const content = JSON.stringify(object);
        writer.write({
          type: "data-document",
          data: {
            id: id,
            type: "object",
            object: object,
          },
        });
        draftContent = object;
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
      object: draftContent,
    });

    return {
      id,
      title,
      kind,
      content: draftContent,
    };
  } catch (error) {
    console.error("Error during presentation creation: ", error);
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
