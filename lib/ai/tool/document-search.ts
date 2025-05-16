import { tool } from 'ai';
import { z } from 'zod';
import type { Document } from '@/types/document';

export const documentSearch = tool({
    description: 'Execute this function if you want to query company benefits',
    parameters:
        z.object({
            query: z.string().describe('The query to search for which must also be rewritten for better context if necessary as this will be used to search the document'),
            //keywords: z.array(z.string().describe('The a few keywords to search for in the document')),
        }),
    execute: async function ({ }) {

        const doc: Document = {
            id: "1",
            sourceType: "text", // doc, url, file
            title: "Company Benefits.pdf",
            content: "2025: Flex allowance is allowed up to 500 baht per month",
            metadata: {
                page: 1
            }
        }

        const url: Document = {
            id: "2",
            sourceType: "url", // doc, url, file
            title: "Company Benefits.com",
            content: "2024: Flex allowance is allowed up to 500 baht per month",
        }
        return [doc, url] as Document[];
    },
});