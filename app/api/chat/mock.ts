import { streamText, simulateReadableStream } from 'ai';
import { MockLanguageModelV2 } from 'ai/test';

export async function mock() {

    const result = streamText({
        model: new MockLanguageModelV2({

            doGenerate: async () => ({
                stream: simulateReadableStream({
                    chunks: [
                        { type: 'text', textDelta: 'Hello' },
                        { type: 'text', textDelta: ', ' },
                        { type: 'text', textDelta: `you ` },
                        { type: 'text', textDelta: `are ` },
                        { type: 'text', textDelta: `not ` },
                        { type: 'text', textDelta: `logged ` },
                        { type: 'text', textDelta: `in!` },
                        {
                            type: 'finish',
                            finishReason: 'stop',
                            logprobs: undefined,
                            usage: { outputTokens: 0, inputTokens: 0 },
                        },
                    ],
                }),
                rawCall: { rawPrompt: null, rawSettings: {} },
            }),
        }),
        prompt: 'Hello, test!',
    });

    return result;
}