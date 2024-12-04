"use client";
import { createContext, useContext } from "react";
import { useChat } from "@/lib/hooks/useChat";

// to import from useChat.ts
interface Message {
  _id?: string;
  role: "system" | "user" | "assistant";
  content: string;
  loading?: boolean;
}

interface ChatContextValue {
  userInput: string;
  setUserInput: (input: string) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  handleKeypress: (e: KeyboardEvent) => void;
  handleSend: (
    prompt?: string | undefined,
    usecase?: string | undefined
  ) => Promise<void>;
  handleRetry: () => void;
  usecase: string;
  setUsecase: (input: string) => void;
  email: string;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({
  children,
  initialMessages,
  _id,
  email,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialMessages: any[];
  _id: string | null;
  email: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatHook: any = useChat(initialMessages, _id, email);
  return (
    <ChatContext.Provider value={chatHook}>{children}</ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("Chat Context Error");
  }
  return context;
}
