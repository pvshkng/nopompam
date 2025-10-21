import { textHandler } from "./document-text";
import { sheetHandler } from "./document-sheet";
import { codeHandler } from "./document-code";
import { presentationHandler } from "./_document-presentation";
import { pdfHandler } from "./_document-pdf";
import { formHandler } from "./_document-form";
import type { DocumentHandler } from "./types";
import { Code } from "mongodb";

export const documentHandlers: Record<string, DocumentHandler> = {
    text: textHandler,
    sheet: sheetHandler,
    code: codeHandler,
    presentation: presentationHandler,
    pdf: pdfHandler,
    form: formHandler,
};
