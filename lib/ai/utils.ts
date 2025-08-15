import { UIMessage, ModelMessage } from "ai";

export function convertToUIMessages(messages: any) {
    return messages.map((message: any) => ({
        id: message.id,
        role: message.role as 'user' | 'assistant' | 'system',
        parts: message.parts?.map((part: any) => {
            const cleanPart = { ...part };
            delete cleanPart.providerMetadata;
            delete cleanPart.providerOptions;

            if (cleanPart.providerMetadata?.google) {
                delete cleanPart.providerMetadata.google;
            }

            return cleanPart;
        }) || [],
    }));
}

export function removeProviderExecuted(messages: UIMessage[]): UIMessage[] {
    return messages.map(message => ({
        ...message,
        parts: message.parts
            .map(part => {
                if ('providerExecuted' in part) {
                    const { providerExecuted, ...rest } = part;
                    return rest;
                }
                return part;
            })
            .filter(Boolean),
    }));
}