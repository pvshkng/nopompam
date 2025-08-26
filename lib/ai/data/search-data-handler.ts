import { useToolStore } from "@/lib/stores/tool-store";
import type { SearchData } from "./types";

export const handleSearchData = (searchData: SearchData): void => {
    const { toolCallId } = searchData;

    switch (searchData.type) {
        case "init":
            console.log("Initializing search tool:", searchData);
            useToolStore
                .getState()
                .initializeDraftTool(
                    toolCallId,
                    searchData.toolType!,
                    searchData.queries!
                );
            break;

        case "query-complete":
            console.log("Query completed:", searchData);
            useToolStore
                .getState()
                .updateQueryStatus(
                    toolCallId,
                    searchData.queryId!,
                    "complete",
                    searchData.result
                );
            break;

        case "query-error":
            console.log("Query error:", searchData);
            useToolStore
                .getState()
                .updateQueryStatus(toolCallId, searchData.queryId!, "error");
            break;

        case "finalize":
            console.log("Finalizing search tool:", searchData);
            useToolStore.getState().finalizeTool(toolCallId, searchData.output);
            break;

        default:
            console.warn("Unknown search data type:", (searchData as any).type);
    }
};