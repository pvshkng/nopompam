import { create } from "zustand";

export const useArtifactStore = create((set) => ({
    artifacts: {},
    updateArtifact: (id, update) =>
        set((state) => ({
            artifacts: {
                ...state.artifacts,
                [id]: { ...(state.artifacts[id] || {}), ...update },
            },
        })),
}));