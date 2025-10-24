import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const artifactModel = 'gemini-2.5-flash';
export const client = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    baseURL: process.env.GOOGLE_API_ENDPOINT,
});
export const artifactWriter = client(artifactModel);