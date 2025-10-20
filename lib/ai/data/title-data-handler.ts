import { handleNewThread } from "@/lib/thread/new-thread-handler";
import type { TitleData, DataHandlerContext } from "./types";

export const handleTitleData = (
    titleData: TitleData,
    context: DataHandlerContext,
    data: any
): void => {
    try {
        console.log("Creating new thread with title:", titleData.title);
        handleNewThread({
            data,
            _id: context._id,
            email: context.email,
            setThreads: context.setThreads,
            params: context.params,
        });
    } catch (error) {
        console.error("Error handling thread data:", error);
    }
};