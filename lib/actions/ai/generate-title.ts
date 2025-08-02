"use server"

import { generateText, UIMessage, ModelMessage } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

export async function generateTitle(message: UIMessage[]) {
    //console.log("generateTitle: ", message[0].parts[0].text);
    const _prompt =
        `Generate a title for this conversation thread.
        The title should be short, no more than 10 words.
        No special characters, no emojis.
        <conversation>
        ${JSON.stringify(message)}
        </conversation>`;

    const provider = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });

    try {
        const result = await generateText({
            model: provider("gemini-2.0-flash-001"),
            prompt: _prompt,
        })
        console.log("_prompt: ", _prompt);
        return result.text;

    } catch (error) {
        console.error(error);
        return "New chat"
    }

}
