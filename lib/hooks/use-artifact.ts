'use client';

import { useEffect, useState, useMemo } from 'react';

export const initialArtifactData = {
    artifactId: 'init',
    content: '',
    kind: 'text',
    title: '',
    status: 'idle',
    isVisible: false,
};


export function useArtifact(data: any) {
    const [message, setMessage] = useState(data);

    const [artifact, setArtifact] = useState(initialArtifactData);
    const toolResult = message.parts.find(
        (p) => p.type === 'tool-result' && p.toolName === 'createArtifact'
    );
    const base = toolResult?.result;

    // Listen for streaming deltas in message.parts
    const [content, setContent] = useState(base?.content || '');

    useEffect(() => {
        // Find all text-delta parts and concatenate
        const deltas = message.parts
            .filter((p) => p.type === 'text-delta')
            .map((p) => p.content)
            .join('');
        if (deltas) setContent(deltas);
        console.log('content', content);
        console.log('deltas', deltas);
        console.log("message", message)
    }, [message.parts]);

    return {
        id: base?.id,
        title: base?.title,
        kind: base?.kind,
        content,
    };
}

export type DataStreamDelta = {
    type:
    | 'text-delta'
    | 'code-delta'
    | 'sheet-delta'
    | 'image-delta'
    | 'title'
    | 'id'
    | 'suggestion'
    | 'clear'
    | 'finish'
    | 'kind';
    content: string;
};

export function DataStreamHandler() {

}