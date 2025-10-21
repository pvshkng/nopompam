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

export const formHandler: DocumentHandler = async ({
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
        Generate a form artifact about the given topic.
        - If the topic is a job opening, generate a job opening form with fields: role, salary, skills, description.
        - If the topic is an Azure resource request, generate a form with fields: resourceType (one of VM, Storage, SQL, AppService, Function), details.
        - Return as JSON: { type: "job" | "azure", data: { ... } }
        - Do not include markdown, only JSON.
        - Do not wrap output in backticks or code blocks.
        </instructions>

        Now generate a form artifact about: ${title}
      `,
    },
  ] as ModelMessage[];

  const formSchema = z.object({
    type: z.enum(["job", "azure"]).describe("Form type"),
    data: z.record(z.string()).describe("Form data fields"),
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
      schema: formSchema,
      messages: prompt,
      onError: (error) => {
        console.error("Error during form creation: ", error);
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
    console.error("Error during form creation: ", error);
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
