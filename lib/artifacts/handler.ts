export type Artifact = {
    id: string;
    kind?: string;
    title?: string;
    content: string;
    status?: string;
    isVisible?: boolean;
};

const initialArtifactData = {
    artifactId: 'init',
    content: '',
    kind: 'text',
    title: '',
    status: 'idle',
    isVisible: false,
};

export function artifactStreamHandler(
    streamItem: any,
    prevArtifacts: Artifact[]
): Artifact[] {
    // For "id", always use streamItem.content as the new id
    if (streamItem.type === "id") {
        const exists = prevArtifacts.some(a => a.id === streamItem.content);
        if (!exists) {
            return [
                ...prevArtifacts,
                {
                    id: streamItem.content,
                    content: "",
                    status: "idle",
                    isVisible: true,
                },
            ];
        }
        return prevArtifacts;
    }

    // For all other types, find the correct id to update
    let id = streamItem.id;
    if (!id && prevArtifacts.length > 0) {
        // fallback to last artifact if id is missing
        id = prevArtifacts[prevArtifacts.length - 1].id;
    }
    if (!id) return prevArtifacts;

    switch (streamItem.type) {
        //case "clear":
        //    return [];
        case "kind":
            return prevArtifacts.map(a =>
                a.id === id ? { ...a, kind: streamItem.content } : a
            );
        case "title":
            return prevArtifacts.map(a =>
                a.id === id ? { ...a, title: streamItem.content } : a
            );
        case "text-delta":
            return prevArtifacts.map(a =>
                a.id === id
                    ? { ...a, content: (a.content || "") + streamItem.content }
                    : a
            );
        case "finish":
            return prevArtifacts.map(a =>
                a.id === id ? { ...a, status: "finished" } : a
            );
        default:
            return prevArtifacts;
    }
}