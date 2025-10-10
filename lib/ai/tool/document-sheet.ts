import { streamObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { storeArtifact } from '@/lib/mongo/artifact-store';
import { z } from 'zod';
import type { ModelMessage } from 'ai';
import type { DocumentHandler } from './types';

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
    if (message.role === 'tool') {
      return {
        role: 'tool',
        content: message.content.map((content) => ({
          type: 'tool-result',
          toolCallId: content.toolCallId,
          toolName: content.toolName,
          output: {
            type: 'text',
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
      role: 'user',
      content: `
          <instructions>
          Generate a spreadsheet about the given topic.
          Create structured data that will be displayed in a spreadsheet component.
          
          Guidelines:
          - Create meaningful data based on the topic
          - Use appropriate column headers that describe the data
          - Optionally provide row labels if they add context
          - Ensure all rows have the same number of columns
          - Keep data concise and relevant
          - Use realistic and accurate values
          
          The data will be rendered in a spreadsheet component, so structure it appropriately.
          </instructions>

          Now generate a spreadsheet about the following topic:
          ${title}
          `,
    },
  ] as ModelMessage[];

  const spreadsheetSchema = z.object({
    columnLabels: z
      .array(z.string())
      .describe('Column headers for the spreadsheet'),
    rowLabels: z
      .array(z.string())
      .optional()
      .describe('Optional row labels for the spreadsheet'),
    data: z
      .array(z.array(z.string()))
      .describe('2D array of cell values, where each inner array represents a row'),
  });


  writer.write({
    type: 'data-document',
    data: {
      id: id,
      type: 'init',
      content: {
        id,
        title,
        kind,
      },
    },
  });

  writer.write({
    type: 'data-document',
    data: {
      id: id,
      type: 'start',
      content: '',
    },
  });

  let finalContent = '';

  try {
    const { partialObjectStream, object } = streamObject({
      model: client('gemini-2.5-flash'),
      schema: spreadsheetSchema,
      messages: prompt,
      onError: (error) => {
        console.error('Error during sheet creation: ', error);
        writer.write({
          type: 'data-document',
          data: {
            id: id,
            type: 'error',
            content: error,
          },
        });
      },
    });

    for await (const partialObject of partialObjectStream) {
      const streamData = {
        columnLabels: partialObject.columnLabels || [],
        rowLabels: partialObject.rowLabels || [],
        data: partialObject.data || [],
      };

      const contentString = JSON.stringify(streamData);

      writer.write({
        type: 'data-document',
        data: {
          id: id,
          type: 'text',
          content: contentString,
        },
      });
    }

    const finalObject = await object;

    const finalData = {
      columnLabels: finalObject.columnLabels || [],
      rowLabels: finalObject.rowLabels || [],
      data: finalObject.data || [],
    };

    finalContent = JSON.stringify(finalData);

    writer.write({
      type: 'data-document',
      data: {
        id: id,
        type: 'stop',
        content: '',
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
    console.error('Error during sheet creation: ', error);
    writer.write({
      type: 'data-document',
      data: {
        id: id,
        type: 'error',
        content: error,
      },
    });
    throw error;
  }
};