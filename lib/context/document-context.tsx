// contexts/DocumentStreamContext.tsx
import React, { createContext, useContext, useCallback, useSyncExternalStore, useMemo, useRef } from 'react';

type DocumentData = {
  id: string;
  title?: string;
  kind?: string;
  content: string;
  isStreaming: boolean;
};

type DocumentStreamContextType = {
  store: DocumentStreamStore;
};

class DocumentStreamStore {
  private documents = new Map<string, DocumentData>();
  private listeners = new Map<string, Set<() => void>>();
  private snapshotCache = new Map<string, DocumentData>();

  getDocument = (id: string): DocumentData => {
    // Check cache first
    if (this.snapshotCache.has(id)) {
      return this.snapshotCache.get(id)!;
    }

    const doc = this.documents.get(id) || {
      id,
      content: '',
      isStreaming: false,
    };

    // Cache the result
    this.snapshotCache.set(id, doc);
    return doc;
  };

  updateDocument = (id: string, updates: Partial<DocumentData>) => {
    const current = this.documents.get(id) || {
      id,
      content: '',
      isStreaming: false,
    };
    const updated = { ...current, ...updates };
    this.documents.set(id, updated);
    
    // Update cache
    this.snapshotCache.set(id, updated);
    
    this.notifyListeners(id);
  };

  appendContent = (id: string, content: string) => {
    const current = this.documents.get(id) || {
      id,
      content: '',
      isStreaming: false,
    };
    const updated = {
      ...current,
      content: current.content + content,
      isStreaming: true,
    };
    this.documents.set(id, updated);
    
    // Update cache
    this.snapshotCache.set(id, updated);
    
    this.notifyListeners(id);
  };

  clearContent = (id: string) => {
    this.updateDocument(id, { content: '', isStreaming: true });
  };

  finishStreaming = (id: string) => {
    this.updateDocument(id, { isStreaming: false });
  };

  subscribe = (id: string, callback: () => void) => {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, new Set());
    }
    this.listeners.get(id)!.add(callback);

    return () => {
      const listeners = this.listeners.get(id);
      if (listeners) {
        listeners.delete(callback);
        if (listeners.size === 0) {
          this.listeners.delete(id);
          // Also clear cache when no listeners
          this.snapshotCache.delete(id);
        }
      }
    };
  };

  private notifyListeners = (id: string) => {
    const listeners = this.listeners.get(id);
    if (listeners) {
      listeners.forEach(callback => callback());
    }
  };
}

// Create a single instance of the store
const documentStore = new DocumentStreamStore();

const DocumentStreamContext = createContext<DocumentStreamContextType | null>(null);

export const useDocumentStream = (documentId: string) => {
  const context = useContext(DocumentStreamContext);
  
  if (!context) {
    throw new Error('useDocumentStream must be used within DocumentStreamProvider');
  }

  const { store } = context;

  // Create stable references using useRef
  const subscribeRef = useRef<(callback: () => void) => () => void>();
  const getSnapshotRef = useRef<() => DocumentData>();

  // Initialize refs if they don't exist
  if (!subscribeRef.current) {
    subscribeRef.current = (callback: () => void) => store.subscribe(documentId, callback);
  }

  if (!getSnapshotRef.current) {
    getSnapshotRef.current = () => store.getDocument(documentId);
  }

  return useSyncExternalStore(subscribeRef.current, getSnapshotRef.current);
};

export const DocumentStreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a stable context value
  const contextValue = useMemo(() => ({
    store: documentStore,
  }), []);

  return (
    <DocumentStreamContext.Provider value={contextValue}>
      {children}
    </DocumentStreamContext.Provider>
  );
};

// Export store methods for use in Root component
export const documentStreamActions = {
  updateDocument: documentStore.updateDocument,
  appendContent: documentStore.appendContent,
  clearContent: documentStore.clearContent,
  finishStreaming: documentStore.finishStreaming,
};