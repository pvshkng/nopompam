import { textHandler } from "./document-text";
import { sheetHandler } from "./document-sheet";
import { codeHandler } from "./document-code";
import type { DocumentHandler } from "./types";
import { Code } from "mongodb";

export const documentHandlers: Record<string, DocumentHandler> = {
    text: textHandler,
    sheet: sheetHandler,
    code: codeHandler,
};