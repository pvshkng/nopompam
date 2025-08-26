export interface DataDocument {
    id: string;
    type: "init" | "start" | "text" | "stop" | "error";
    content: any;
}

export interface SearchData {
    toolCallId: string;
    type: "init" | "query-complete" | "query-error" | "finalize";
    toolType?: string;
    queries?: any[];
    queryId?: string | number;
    result?: any;
    output?: any;
}

export interface TitleData {
    title: string;
}

export interface DataHandlerContext {
    _id: string | undefined;
    email: string | null | undefined;
    setThreads: (threads: any[]) => void;
    params: any;
}