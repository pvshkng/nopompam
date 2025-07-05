"use client";
import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { useChatOptions } from "@/lib/hooks/use-chat-options";
import { useState, useCallback, useRef } from "react";

interface ChatContextValue {
  maxTurn: number;
  setMaxTurn: Dispatch<SetStateAction<number>>;
  model: string | undefined;
  setModel: Dispatch<SetStateAction<string | undefined>>;
  agent: string | undefined;
  setAgent: Dispatch<SetStateAction<string | undefined>>;
}
interface ChatProviderProps {
  children: React.ReactNode;
}
const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: ChatProviderProps) {
  const [maxTurn, setMaxTurn] = useState(3);
  const [model, setModel] = useState<string | undefined>(undefined);
  const [agent, setAgent] = useState<string | undefined>(undefined);
  const value: ChatContextValue = {
    maxTurn,
    setMaxTurn,
    model,
    setModel,
    agent,
    setAgent,
  };
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("Chat Context Error");
  }
  return context;
}
