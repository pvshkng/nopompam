import { create } from 'zustand';

interface InputStore {
    input: string;
    setInput: (input: string) => void;
    clearInput: () => void;
}

export const useInputStore = create<InputStore>((set) => ({
    input: '',
    setInput: (input: string) => set({ input }),
    clearInput: () => set({ input: '' }),
}));
