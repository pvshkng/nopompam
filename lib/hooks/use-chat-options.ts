import { useState, useCallback, useRef } from "react";
import { generateObjectId } from "@/lib/utils";

type Message = {
    role: "system" | "user" | "assistant";
    content: string;
    loading?: boolean;
    _id: string;
};

export function useChatSettings(
    initialSettings: Record<string, unknown>,
    _id: string | null,
    email: string
) {
    const [maxTurn, setMaxTurn] = useState(3);
    const [model, setModel] = useState(undefined);
    const [usecase, setUsecase] = useState("auto");

    return {
        maxTurn, setMaxTurn,
        model, setModel,
  


        usecase,
        setUsecase,

        _id,
        email,
    };
}
