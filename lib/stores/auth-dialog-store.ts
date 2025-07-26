import { create } from "zustand";

type AuthDialogState = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    open: () => void;
    close: () => void;
};

export const useAuthDialogStore = create<AuthDialogState>((set) => ({
    isOpen: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));
