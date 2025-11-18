import { create } from 'zustand';
import type { UIMessage } from 'ai';
import { object } from 'zod';

export interface Document {
    id: string;
    title: string;
    kind: string;
    content: string;
    object?: any;
    isStreaming?: boolean;
    hasUnsavedChanges?: boolean;
    streamingContent?: string;
    appendStreamingContent?: (content: string) => void;
    clearStreamingContent?: () => void;
}

export type DossierStore = {
    dossierOpen: boolean;
    documents: Document[];
    activeTab: string | null; // 'home' | document.id
    chatDocuments: Document[];
};

export type DossierActions = {
    // Basic dossier actions
    setDossierOpen: (open: boolean) => void;
    openDossier: (initialTab?: string) => void;
    closeDossier: () => void;
    resetDossier: () => void;

    // Tab management
    setActiveTab: (tab: string | null) => void;
    switchTab: (tab: string) => void;
    closeTab: (tabId: string) => boolean; // returns false if user cancels

    // Document management
    addDocument: (document: Omit<Document, 'isStreaming' | 'hasUnsavedChanges' | 'streamingContent'>) => void;
    updateDocument: (id: string, updates: Partial<Document>) => void;
    removeDocument: (id: string) => void;
    getDocument: (id: string) => Document | undefined;

    // Streaming management
    startDocumentStreaming: (id: string) => void;
    appendDocumentContent: (id: string, content: string) => void;
    setDocumentObject: (id: string, object: any) => void;
    stopDocumentStreaming: (id: string) => void;

    // Content editing
    updateDocumentContent: (id: string, content: string) => void;
    markDocumentSaved: (id: string) => void;

    // Chat document in the active thread
    syncChatDocuments: (messages: any[]) => void;
    clearChatDocuments: () => void;

};

const validTypes = [
    'tool-document',
    'tool-createText',
    'tool-createSheet',
    'tool-createPython',
    'tool-createJavascript',
    'tool-createSql',
]


export const useDossierStore = create<DossierStore & DossierActions>((set, get) => ({
    dossierOpen: false,
    documents: [],
    chatDocuments: [],
    activeTab: 'home',

    // Basic dossier actions
    setDossierOpen: (open) => set({ dossierOpen: open }),

    openDossier: (initialTab = 'home') => set({
        dossierOpen: true,
        activeTab: initialTab
    }),

    closeDossier: () => set({
        dossierOpen: false,
        activeTab: null
    }),

    resetDossier: () => set({
        dossierOpen: false,
        documents: [],
        activeTab: null
    }),

    // Tab management
    setActiveTab: (tab) => set({ activeTab: tab }),

    switchTab: (tab) => set({
        activeTab: tab,
        dossierOpen: true
    }),

    closeTab: (tabId) => {
        const state = get();
        const document = state.documents.find(doc => doc.id === tabId);

        // Check for unsaved changes
        if (document?.hasUnsavedChanges) {
            const confirmClose = window.confirm(
                `You have unsaved changes in "${document.title}". Are you sure you want to close this tab?`
            );
            if (!confirmClose) {
                return false;
            }
        }

        // Close tab logic
        let newActiveTab = state.activeTab;
        if (state.activeTab === tabId) {
            // Find next tab to activate
            const remainingDocs = state.documents.filter(doc => doc.id !== tabId);
            newActiveTab = remainingDocs.length > 0 ? remainingDocs[0].id : 'home';
        }

        set({ activeTab: newActiveTab });
        return true;
    },

    // Document management
    addDocument: (document) => {
        // Check if document already exists
        const state = get();
        const existingDoc = state.documents.find(doc => doc.id === document.id);
        if (existingDoc) {
            console.warn(`Document with id "${document.id}" already exists in the dossier.`);
            //switch tab to existing document
            set({ activeTab: existingDoc.id, dossierOpen: true });
            return;
        } else {
            const newDoc: Document = {
                ...document,
                isStreaming: false,
                hasUnsavedChanges: false,
                streamingContent: ''
            };

            set((state) => ({
                documents: [...state.documents, newDoc],
                dossierOpen: true,
                activeTab: newDoc.id
            }));
        }

    },

    updateDocument: (id, updates) => set((state) => ({
        documents: state.documents.map(doc =>
            doc.id === id ? { ...doc, ...updates } : doc
        )
    })),

    removeDocument: (id) => set((state) => ({
        documents: state.documents.filter(doc => doc.id !== id)
    })),

    getDocument: (id) => {
        const state = get();
        return state.documents.find(doc => doc.id === id);
    },

    // Streaming management
    startDocumentStreaming: (id) => {
        set((state) => ({
            documents: state.documents.map(doc =>
                doc.id === id
                    ? { ...doc, isStreaming: true, streamingContent: '' }
                    : doc
            )
        }));
    },

    appendDocumentContent: (id, content) => {
        set((state) => ({
            documents: state.documents.map(doc =>
                doc.id === id
                    ? { ...doc, streamingContent: doc.streamingContent + content }
                    : doc
            )
        }));
    },

    setDocumentObject: (id, content) => {
        set((state) => ({
            documents: state.documents.map(doc =>
                doc.id === id
                    ? { ...doc, object: doc.object }
                    : doc
            )
        }));
    },


    stopDocumentStreaming: (id) => {
        set((state) => ({
            documents: state.documents.map(doc =>
                doc.id === id
                    ? {
                        ...doc,
                        isStreaming: false,
                        content: doc.content + doc.streamingContent,
                        streamingContent: ''
                    }
                    : doc
            )
        }));
    },

    // Content editing
    updateDocumentContent: (id, content) => {
        set((state) => ({
            documents: state.documents.map(doc =>
                doc.id === id
                    ? { ...doc, content, hasUnsavedChanges: true }
                    : doc
            )
        }));
    },

    markDocumentSaved: (id) => {
        set((state) => ({
            documents: state.documents.map(doc =>
                doc.id === id
                    ? { ...doc, hasUnsavedChanges: false }
                    : doc
            )
        }));
    },

    syncChatDocuments: (messages: UIMessage[]) => {
        const toolDocuments: Document[] = [];

        messages.forEach(message => {
            if (message.parts) {
                message.parts.forEach(part => {
                    if (validTypes.includes(part.type) && part.output) {
                        const output = part.output as { id: string; title: string; kind: string; content: string };
                        toolDocuments.push({
                            id: output.id,
                            title: output.title,
                            kind: output.kind,
                            content: output.content || '',
                        });
                    }
                });
            }
        });

        // Only update if documents actually changed
        const currentDocs = get().chatDocuments;

        // Deep comparison to prevent unnecessary updates
        if (JSON.stringify(toolDocuments) !== JSON.stringify(currentDocs)) {
            set({ chatDocuments: toolDocuments });
        }
    },


    clearChatDocuments: () => set({ chatDocuments: [] }),
}));