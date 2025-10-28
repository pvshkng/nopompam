import { UIMessageStreamWriter, tool } from "ai";
import { z } from "zod";
import type { ModelMessage } from 'ai';
import { documentHandlers } from './document-handler';

interface DocumentProps {
  threadId: string;
  user: any;
  getMemory: () => ModelMessage[];
  writer: UIMessageStreamWriter;
}

export const document = ({ threadId, user, getMemory, writer }: DocumentProps) =>
  tool({
    description: `
    ## document
    # The "document" tool creates and updates text documents that render to the user on a space next to the conversation (referred to as the "dossier").
    # Use this tool when asked to work on writing that's long enough like article / essay.
    # Only invoke this tool once for each document you want to create.
    # **DO NOT REPEAT THE GENERATED CONTENT OR RESULT OF THIS TOOL SINCE THE RESULT WILL BE VISIBLE TO THE USER.**
    # You may let the user know that you have created a document and they can view it on the side panel.
    `,
    inputSchema: z.object({
      title: z.string().describe("The title of the artifact. If the title is not provided, it will be inferred from the prompt."),
      kind: z
        .enum(["text", "sheet", "code", "presentation", "pdf", "form"])
        .describe("The kind of document to create. 'text' for rich text documents, 'sheet' for spreadsheets, 'code' for code files, 'presentation' for slide decks, 'pdf' for PDF documents, and 'form' for forms."),
    }),
    execute: async ({ title, kind }, { toolCallId }) => {

      const id = toolCallId;
      try {
        const handler = documentHandlers[kind];

        if (!handler) {
          throw new Error(`Handler for kind "${kind}" not found`);
        }

        return await handler({
          id,
          title,
          kind,
          threadId,
          user,
          getMemory,
          writer,
        });
      } catch (error) {
        console.error('Error during artifact creation: ', error);
        writer.write({
          type: 'data-document',
          data: {
            id: id,
            type: 'error',
            content: error,
          },
        });
        return error;
      }
    },
  });
