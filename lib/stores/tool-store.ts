// stores/useToolStore.ts
import { create } from 'zustand';

export interface SearchQuery {
    id: string;
    content: string;
    status: 'pending' | 'complete' | 'error';
    results?: any[];
}

export interface DraftToolCall {
    toolCallId: string;
    type: string;
    state: 'input-streaming' | 'input-available' | 'output-available';
    input?: {
        queries: string[];
    };
    output?: {
        results: { [key: number]: any };
    };
    draftQueries: { [key: number]: SearchQuery };
    isStreaming: boolean;
}

interface ToolStore {
    draftToolCalls: { [toolCallId: string]: DraftToolCall };

    // Actions
    initializeDraftTool: (toolCallId: string, type: string, queries: string[]) => void;
    updateQueryStatus: (toolCallId: string, queryId: number, status: SearchQuery['status'], results?: any[]) => void;
    finalizeTool: (toolCallId: string, output: any) => void;
    clearDraftTool: (toolCallId: string) => void;
    getDraftTool: (toolCallId: string) => DraftToolCall | undefined;
}

export const useToolStore = create<ToolStore>((set, get) => ({
    draftToolCalls: {},

    initializeDraftTool: (toolCallId: string, type: string, queries: string[]) => {
        set((state) => ({
            draftToolCalls: {
                ...state.draftToolCalls,
                [toolCallId]: {
                    toolCallId,
                    type,
                    state: 'input-available',
                    input: { queries },
                    draftQueries: queries.reduce((acc, query, index) => ({
                        ...acc,
                        [index]: {
                            id: index.toString(),
                            content: query,
                            status: 'pending',
                        }
                    }), {}),
                    isStreaming: true,
                }
            }
        }));
    },

    updateQueryStatus: (toolCallId: string, queryId: number, status: SearchQuery['status'], results?: any[]) => {
        set((state) => {
            const draftTool = state.draftToolCalls[toolCallId];
            if (!draftTool) return state;

            return {
                draftToolCalls: {
                    ...state.draftToolCalls,
                    [toolCallId]: {
                        ...draftTool,
                        draftQueries: {
                            ...draftTool.draftQueries,
                            [queryId]: {
                                ...draftTool.draftQueries[queryId],
                                status,
                                results,
                            }
                        }
                    }
                }
            };
        });
    },

    finalizeTool: (toolCallId: string, output: any) => {
        set((state) => {
            const draftTool = state.draftToolCalls[toolCallId];
            if (!draftTool) return state;

            // Instead of keeping the draft, we can remove it since tool.output will take over
            const { [toolCallId]: removed, ...rest } = state.draftToolCalls;

            return { draftToolCalls: rest };
        });
    },

    clearDraftTool: (toolCallId: string) => {
        set((state) => {
            const { [toolCallId]: removed, ...rest } = state.draftToolCalls;
            return { draftToolCalls: rest };
        });
    },

    getDraftTool: (toolCallId: string) => {
        return get().draftToolCalls[toolCallId];
    },
}));