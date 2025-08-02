export type Artifact = {
    artifactId: string;
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
    console.log("streamItem: ", streamItem);
    if (streamItem.type === "id") {
        const exists = prevArtifacts.some(a => a.artifactId === streamItem.content);
        if (!exists) {
            return [
                ...prevArtifacts,
                {
                    artifactId: streamItem.content,
                    //threadId: prevArtifacts[0]?.threadId || '',
                    //user: prevArtifacts[0]?.user || '',
                    kind: 'text',
                    title: '',
                    content: "",
                    status: "idle",
                    isVisible: true,
                    //timestamp: Date.now().toString()
                },
            ];
        }
        return prevArtifacts;
    }

    // For all other types, find the correct id to update
    let id = streamItem.id;
    if (!id) {
        console.warn('No id provided for stream item:', streamItem);
        return prevArtifacts;
    }

    switch (streamItem.type) {
        case "kind":
            return prevArtifacts.map(a =>
                a.artifactId === id ? { ...a, kind: streamItem.content } : a
            );
        case "title":
            return prevArtifacts.map(a =>
                a.artifactId === id ? { ...a, title: streamItem.content } : a
            );
        case "clear":
            return prevArtifacts.map(a =>
                a.artifactId === id ? { ...a, content: "" } : a
            );
        case 'text':
            return prevArtifacts.map(a =>
                a.artifactId === id
                    ? { ...a, content: (a.content || "") + streamItem.content }
                    : a
            );
        case "finish":
            return prevArtifacts.map(a =>
                a.artifactId === id ? { ...a, status: "finished" } : a
            );
        default:
            return prevArtifacts;
    }
}