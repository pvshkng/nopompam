import { create, } from 'zustand';

export type DossierStore = {
    dossierOpen: boolean;
    documents: any[];
    activeTab: string | null;
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
};

export const useDossierStore = create<DossierStore & DossierActions>((set) => ({
    dossierOpen: false,
    documents: [],
    activeTab: null,

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
        activeTab: null
    }),

    switchTab: (tab) => set((state) => ({
        activeTab: tab,
        dossierOpen: true
    })),
}));
