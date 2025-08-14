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