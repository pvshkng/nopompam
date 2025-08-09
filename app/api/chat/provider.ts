import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from '@ai-sdk/openai';
import { createMistral } from '@ai-sdk/mistral';

export const getProvider = (model: string) => {
    let provider
    switch (model) {
        case "ministral-3b-latest":
        case "ministral-8b-latest":
        case "mistral-large-latest":
        case "mistral-small-latest":
        case "pixtral-large-latest":
        case "pixtral-12b-2409":
        case "open-mistral-7b":
        case "open-mixtral-8x7b":
        case "open-mixtral-8x22b":
            provider = createMistral({
                apiKey: process.env.MISTRAL_API_KEY,
            })
            break;

        case "moonshotai/kimi-k2:free":
        case "qwen/qwen3-coder:free":
        case "qwen/qwen3-235b-a22b:free":

        case "qwen/qwen3-30b-a3b:free":
        case "deepseek/deepseek-r1-0528:free":
        case "deepseek/deepseek-r1:free":
        case "deepseek/deepseek-chat-v3-0324:free":
        case "deepseek/deepseek-r1-0528-qwen3-8b:free":
        case "tngtech/deepseek-r1t2-chimera:free":
        case "cognitivecomputations/dolphin-mistral-24b-venice-edition:free":
            provider = createOpenAI({
                apiKey: process.env.OPENROUTER_API_KEY,
                baseURL: "https://openrouter.ai/api/v1"
            });
            break;

        case "typhoon-v2.1-12b-instruct":
            provider = createOpenAI({
                apiKey: process.env.TYPHOON_API_KEY,
                baseURL: process.env.TYPHOON_URL,
                headers: {
                    "Authorization": `Bearer ${process.env.TYPHOON_API_KEY}`,
                }
            });
            break;

        case "gemini-2.5-pro":
        case "gemini-2.5-pro-preview-05-06":
        case "gemini-2.5-flash":
        case "gemini-2.5-flash-preview-04-17":
        case "gemini-2.5-flash-lite-preview-06-17":
        default:
            provider = createGoogleGenerativeAI({
                apiKey: process.env.GOOGLE_API_KEY,
                baseURL: process.env.GOOGLE_API_ENDPOINT,
            });
            break;
    }
    return provider
};