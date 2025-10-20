import { handleSearchData } from "./search-data-handler";
import { handleDocumentData } from "./document-data-handler";
import { handleTitleData } from "./title-data-handler";
import type { DataHandlerContext } from "./types";

export type DataType = "data-tool-search" | "data-document" | "data-title";

export interface DataHandler<T = any> {
    handle: (data: T, context?: DataHandlerContext, rawData?: any) => void;
    validate?: (data: any) => boolean;
}

export const dataHandlers: Record<DataType, DataHandler> = {
    "data-tool-search": {
        handle: handleSearchData,
        validate: (data) => data && typeof data.toolCallId === "string",
    },
    "data-document": {
        handle: handleDocumentData,
        validate: (data) => data && typeof data.id === "string" && data.type,
    },
    "data-title": {
        handle: (data, context, rawData) =>
            handleTitleData(data, context!, rawData),
        validate: (data) => data && typeof data.title === "string",
    },
};

export const processDataEvent = (
    type: string,
    data: any,
    context?: DataHandlerContext,
    rawData?: any
): boolean => {
    const handler = dataHandlers[type as DataType];

    if (!handler) {
        console.warn(`No handler found for data type: ${type}`);
        return false;
    }

    if (handler.validate && !handler.validate(data)) {
        console.error(`Invalid data for type ${type}:`, data);
        return false;
    }

    try {
        handler.handle(data, context, rawData);
        return true;
    } catch (error) {
        console.error(`Error handling ${type}:`, error);
        return false;
    }
};