export interface Artifact {
    id: string;
    kind: "code" | "text" | "file";
    name: string;
    description: string;
    content: {
        code?: string;
        text?: string;
        file?: string;
    };
}