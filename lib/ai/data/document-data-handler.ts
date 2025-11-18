import { useDossierStore } from "@/lib/stores/dossier-store";
import type { DataDocument } from "./types";

export const handleDocumentData = (documentData: DataDocument): void => {
    const { id, type, content, object = null } = documentData;
    const store = useDossierStore.getState();

    switch (type) {
        case "init":
            store.addDocument({
                id: content.id,
                title: content.title,
                kind: content.kind,
                content: "",
            });
            break;

        case "start":
            store.startDocumentStreaming(id);
            break;

        case "text":
            if (content) {
                store.appendDocumentContent(id, content);
            }
            break;

        case "object":
            if (content) {
                store.setDocumentObject(id, object);
            }
            break;

        case "stop":
            store.stopDocumentStreaming(id);
            break;

        case "error":
            console.error(`Error in document ${id}:`, content);
            store.stopDocumentStreaming(id);
            break;

        default:
            console.warn("Unknown document data type:", type);
    }
};