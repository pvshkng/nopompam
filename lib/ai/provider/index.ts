import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from '@ai-sdk/openai';
import { createMistral } from '@ai-sdk/mistral';

export const getProvider = (model: string) => {
    let provider
    switch (model) {

        // case "openai/gpt-5-mini":
        //     provider = "openai/gpt-5-mini";
        //     break;

        case "openai/gpt-oss-120b":
        case "openai/gpt-oss-20b":
        case "moonshotai/kimi-k2-instruct":
        case "qwen/qwen3-32b":
        case "deepseek-r1-distill-llama-70b":
        case "meta-llama/llama-4-maverick-17b-128e-instruct":
        case "meta-llama/llama-4-scout-17b-16e-instruct":
            provider = createOpenAI({
                apiKey: process.env.GROQ_API_KEY,
                baseURL: "https://api.groq.com/openai/v1"
            });
            break;

        case "ministral-3b-latest":
        case "ministral-8b-latest":
        case "mistral-large-latest":
        case "mistral-small-latest":
        case "mistral-medium-latest":
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

        case "typhoon-v2.5-30b-a3b-instruct":
        case "typhoon-v2.1-12b-instruct":
            provider = createOpenAI({
                apiKey: process.env.TYPHOON_API_KEY,
                baseURL: process.env.TYPHOON_URL,
                headers: {
                    "Authorization": `Bearer ${process.env.TYPHOON_API_KEY}`,
                }
            }).chat;
            break;

        case "gemini-3-pro-preview":
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