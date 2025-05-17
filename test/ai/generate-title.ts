const path = require('path');
const dotenv = require('dotenv');
const { generateText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');

dotenv.config({
    path: path.resolve(__dirname, '../../.env.local')
});

const message = "Hello, how are you?";
const _prompt =
    `Generate a title for this conversation thread.
    The title should be short, no more than 10 words.
    <conversation>
    ${message}
    </conversation>`;

const provider = createGoogleGenerativeAI({ apiKey: process.env.GOOGLE_API_KEY });

try {
    const result = generateText({
        model: provider("gemini-2.0-flash-001"),
        prompt: _prompt,
    }).then((response: any) => {
        console.log(response.text);
    });

} catch (error) {
    console.error(error);
}


