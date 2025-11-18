import { create } from 'zustand';

export type FileAttachment = {
    type: 'file';
    filename: string;
    mediaType: string;
    url: string;
    size: number;
}
export type InputStore = {

    // Text input
    input: string;
    setInput: (input: string) => void;
    clearInput: () => void;

    // File input
    files: FileAttachment[];
    setFiles: (files: FileAttachment[]) => void;
    addFiles: (files: FileAttachment[]) => void;
    removeFile: (index: number) => void;
    clearFiles: () => void;

    // Clear all input
    clearAll: () => void;
}

export const useInputStore = create<InputStore>((set) => ({

    // Text input
    input: '',
    setInput: (input: string) => set((state) => ({
        ...state,
        input
    }), true),
    clearInput: () => set((state) => ({
        ...state,
        input: ''
    }), true),

    // File input
    files: [],
    setFiles: (files: FileAttachment[]) => set({ files }),
    addFiles: (newFiles: FileAttachment[]) => set((state) => ({ 
        files: [...state.files, ...newFiles] 
    })),
    removeFile: (index: number) => set((state) => ({
        files: state.files.filter((_, i) => i !== index)
    })),
    clearFiles: () => set({ files: [] }),
    clearAll: () => set({ input: '', files: [] }),
}));