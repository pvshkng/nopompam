import { streamText, simulateReadableStream } from 'ai';
import { MockLanguageModelV1 } from 'ai/test';

export async function mock() {

    const result = streamText({
        model: new MockLanguageModelV1({
            doStream: async () => ({
                stream: simulateReadableStream({
                    chunks: [
                        { type: 'text-delta', textDelta: 'Hello' },
                        { type: 'text-delta', textDelta: ', ' },
                        { type: 'text-delta', textDelta: `you ` },
                        { type: 'text-delta', textDelta: `are ` },
                        { type: 'text-delta', textDelta: `not ` },
                        { type: 'text-delta', textDelta: `logged ` },
                        { type: 'text-delta', textDelta: `in!` },
                        {
                            type: 'finish',
                            finishReason: 'stop',
                            logprobs: undefined,
                            usage: { completionTokens: 0, promptTokens: 0 },
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