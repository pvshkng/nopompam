import { DataStreamWriter } from 'ai';

interface OnCreateDocumentProps {
    id: string;
    title: string;
    dataStream: DataStreamWriter;
    session: any; // Not used in minimal example
}

export const textDocumentHandler = {
    kind: 'text',
    onCreateDocument: async ({ id, title, dataStream }: OnCreateDocumentProps) => {
        // Simulate streaming text content
        const contentChunks = [
            `# ${title}\n\n`,
            'This is the first paragraph.\n\n',
            'This is the second paragraph.\n\n',
            'This is the third paragraph.\n\n',
        ];

        for (const chunk of contentChunks) {
            dataStream.writeData({ type: 'text-delta', content: chunk });
            await new Promise((r) => setTimeout(r, 300));
        }
    },
};