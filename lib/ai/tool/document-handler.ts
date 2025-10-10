import { textHandler } from "./document-text";
import { sheetHandler } from "./document-sheet";
import type { DocumentHandler } from "./types";

export const documentHandlers: Record<string, DocumentHandler> = {
    text: textHandler,
    sheet: sheetHandler,
    code: async () => {
        throw new Error('Code handler not yet implemented');
    },
};