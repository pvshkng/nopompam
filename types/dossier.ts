export type DossierType = "text" | "code" | "file" | "url" | "pdf" | "image" | "video" | "audio" | "html" | "markdown";

export type DossierWindow = {
    id: string;
    type: DossierType;
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