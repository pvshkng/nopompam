import type { UIMessageStreamWriter, ModelMessage } from 'ai';

export interface DocumentHandlerParams {
    id: string;
    title: string;
    kind: string;
    threadId: string;
    user: any;
    getMemory: () => ModelMessage[];
    writer: UIMessageStreamWriter;
}

export interface DocumentHandlerResult {
    id: string;
    title: string;
    kind: string;
    content: string;
}

export type DocumentHandler = (
    params: DocumentHandlerParams
) => Promise<DocumentHandlerResult>;