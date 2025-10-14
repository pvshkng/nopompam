// lib/ai/handlers/document/code-handler.ts
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

export const codeHandler: DocumentHandler = async ({
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
        Generate code for the given task.
        
        Format as JSON with:
        - code: the actual code content
        - language: one of "javascript", "typescript", "python", "sql", "html"
        
        Write clean, well-commented code that follows best practices.
        </instructions>

        Now generate code for: ${title}
        `,
        },
    ] as ModelMessage[];

    const codeSchema = z.object({
        code: z.string().describe("The code content"),
        language: z
            .enum(["javascript", "typescript", "python", "sql", "html"])
            .describe("Programming language"),
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
            schema: codeSchema,
            messages: prompt,
            onError: (error) => {
                console.error("Error during code creation: ", error);
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
                const { code, language } = object;

                if (code && language) {
                    const content = JSON.stringify({ code, language });
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
        console.error("Error during code creation: ", error);
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