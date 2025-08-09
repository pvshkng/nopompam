import { create, } from 'zustand';

export type DossierStore = {
    dossierOpen: boolean;
    documents: any[];
    activeTab: string | null;
    streamingContent: string; 
    isStreaming: boolean; 
};

export type DossierActions = {
    setDossierOpen: (open: boolean) => void;
    setDocuments: (documents: any[]) => void;
    setActiveTab: (tab: string | null) => void;
    openDossier: (initialTab?: string) => void;
    closeDossier: () => void;
    openDossierWithDocuments: (documents: any[], tab?: string) => void;
    resetDossier: () => void;
    switchTab: (tab: string) => void;

    setStreamingContent: (content: string) => void;
    setIsStreaming: (streaming: boolean) => void;
    appendStreamingContent: (content: string) => void;
    clearStreamingContent: () => void;
};


export const useDossierStore = create<DossierStore & DossierActions>((set) => ({
    dossierOpen: false,
    documents: [],
    activeTab: null,
    streamingContent: '',
    isStreaming: false,

    setDossierOpen: (open) => set({ dossierOpen: open }),
    setDocuments: (documents) => set({ documents }),
    setActiveTab: (tab) => set({ activeTab: tab }),

    openDossier: (initialTab = 'overview') => set({
        dossierOpen: true,
        activeTab: initialTab
    }),

    closeDossier: () => set({
        dossierOpen: false,
        activeTab: null
    }),

    openDossierWithDocuments: (documents, tab = 'documents') => set({
        dossierOpen: true,
        documents,
        activeTab: tab
    }),

    resetDossier: () => set({
        dossierOpen: false,
        documents: [],
        activeTab: null,
        streamingContent: '',
        isStreaming: false
    }),

    switchTab: (tab) => set((state) => ({
        activeTab: tab,
        dossierOpen: true
    })),

    
    setStreamingContent: (content) => set({ streamingContent: content }),
    setIsStreaming: (streaming) => set({ isStreaming: streaming }),
    appendStreamingContent: (content) => set((state) => ({
        streamingContent: state.streamingContent + content
    })),
    clearStreamingContent: () => set({ streamingContent: '', isStreaming: false }),
}));
