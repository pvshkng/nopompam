export type Document = {
    id?: string;
    title: string;
    sourceType: "text" | "url" | "file" | "pdf"; // doc, url, file
    url?: string;
    content?: string;
    metadata?: {
        page?: number;
    };
};