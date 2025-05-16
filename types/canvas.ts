export type CanvasType = "text" | "code" | "file" | "url" | "pdf" | "image" | "video" | "audio" | "html" | "markdown";

export type CanvasWindow = {
    id: string;
    type: CanvasType;
    name: string;
    description: string;
    content: {
        text?: string;
        code?: string;
        file?: string;
        url?: string;
        pdf?: string;
        image?: string;
        video?: string;
        audio?: string;
        html?: string;
        markdown?: string;
    };
};