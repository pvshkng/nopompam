import { useState, useCallback, useRef } from "react";
import { generateObjectId } from "@/lib/utils";

type Message = {
    role: "system" | "user" | "assistant";
    content: string;
    loading?: boolean;
    _id: string;
};

export function useChatOptions(
    //initialSettings: Record<string, unknown>,
) {
    const [maxTurn, setMaxTurn] = useState(3);
    const [model, setModel] = useState(undefined);
    const [agent, setAgent] = useState(undefined);

    return {
        maxTurn,
        setMaxTurn,
        model,
        setModel,
        agent,
        setAgent

    };
}
