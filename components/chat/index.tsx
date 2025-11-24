"use client";

import { memo } from "react";
import { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

import { useChat } from "@ai-sdk/react";
import { createIdGenerator, generateId, DefaultChatTransport } from "ai";
import { Dossier } from "@/components/dossier";
import { MobileDossier } from "@/components/dossier/mobile";
import { BottomScrollButton } from "@/components/chat-message-area/scroll-to-bottom";
import { Navigation } from "@/components/chat-navigation";
import { MessageArea } from "@/components/chat-message-area/message-area";
import { UserInput } from "@/components/chat-user-input";
import { LoginDialog } from "@/components/login/login-dialog";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { toast } from "sonner";
import { processDataEvent } from "@/lib/ai/data/";
import type { DataHandlerContext } from "@/lib/ai/data/types";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { useInputStore } from "@/lib/stores/input-store";

type PureRootProps = {
  initialMessages: any[];
  initialThreads: any[];
  initialArtifacts?: any[];
  _id: string | undefined;
  session: any;
  email: string | null | undefined;
  name: string | null | undefined;
  image: string | null | undefined;
};

type Thread = {
  _id: any;
  user: any;
  title: any;
  timestamp: string;
};

interface DataDocument {
  id: string;
  type: "init" | "start" | "text" | "stop" | "error";
  content: any;
}

const chatConfig = {
  experimental_throttle: 50,
  transport: new DefaultChatTransport({
    api: "/api/chat",
    credentials: "include",
  }),
  generateId: createIdGenerator({
    prefix: "msgc",
    size: 16,
  }),
};

function PureRoot(props: PureRootProps) {
  let { initialMessages, initialThreads, _id, session, email, name, image } =
    props;

  const params = useParams();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [threads, setThreads] = useState<Thread[]>(initialThreads || []);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dynamicSpacerHeight, setDynamicSpacerHeight] = useState(0);

  const dataHandlerContext: DataHandlerContext = {
    _id,
    email,
    setThreads,
    params,
  };

  // prettier-ignore
  const { containerRef, scrollToBottom,handleScroll, isBottom, lastUserElementRef,messageRefs } = useScrollToBottom();
  // prettier-ignore
  const { dossierOpen } = useDossierStore();
  const { input, setInput, clearInput, files, clearFiles, setFiles } =
    useInputStore();

  const { messages, setMessages, status, sendMessage, stop } = useChat({
    ...chatConfig,
    id: _id,
    messages: initialMessages,
    onData: useCallback(
      (data) => {
        processDataEvent(data.type, data.data, dataHandlerContext, data);
      },
      [dataHandlerContext]
    ),
    onError: useCallback((e) => {
      console.error("Chat error:", e);
      toast(e.message);
    }, []),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!containerRef.current) return;

      const lastUserMessage = messages.findLast((m) => m.role === "user");
      if (!lastUserMessage) return;

      const lastUserElement = messageRefs.current[lastUserMessage.id];
      if (!lastUserElement) {
        return;
      }

      const containerHeight = containerRef.current.clientHeight;
      const lastMessageHeight = lastUserElement.offsetHeight;

      const newSpacerHeight = Math.max(0, containerHeight - lastMessageHeight);
      setDynamicSpacerHeight(newSpacerHeight);
    }, 100);

    return () => clearTimeout(timer);
  }, [messages]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!input.trim()) return;

      const messageText = input.trim();
      const messageFiles = [...files];
      if (!messageText && messageFiles.length === 0) return;
      clearInput();
      clearFiles();

      try {
        sendMessage(
          { text: messageText, files: messageFiles },
          {
            body: { model },
          }
        );
        setTimeout(() => {
          scrollToBottom();
        }, 1000);
      } catch (error) {
        console.error("Failed to send message:", error);
        setInput(messageText);
        setFiles(messageFiles);
        toast("Failed to send message");
      }
    },
    [
      input,
      files,
      model,
      sendMessage,
      clearInput,
      clearFiles,
      setInput,
      setFiles,
      scrollToBottom,
    ]
  );

  return (
    <>
      <div className="flex flex-col h-full w-full bg-transparent">
        <Navigation
          _id={_id}
          session={session}
          setMessages={setMessages}
          threads={threads}
          setThreads={setThreads}
        />
        <div className="flex flex-row size-full min-h-0 overflow-hidden">
          <div
            className={cn(
              "relative flex h-full w-full min-w-[400px]",
              "flex-1 flex-col overflow-hidden",
              "shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            )}
          >
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel className="relative flex flex-col h-full w-full min-w-[350px]">
                <main
                  className={cn(
                    "relative flex min-h-0 w-full",
                    messages.length !== 0 && "h-full"
                  )}
                >
                  <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    id="scrollArea"
                    className={cn(
                      "relative flex flex-col mx-auto w-full overflow-y-scroll overflow-x-hidden scroll-smooth"
                    )}
                    style={{
                      WebkitOverflowScrolling: "touch",
                      touchAction: "pan-y",
                    }}
                  >
                    <div
                      id="wrapper"
                      ref={wrapperRef}
                      className={cn(
                        "max-w-[800px] w-full",
                        "flex flex-col mx-auto p-6"
                      )}
                    >
                      {messages.length === 0 ? (
                        <></>
                      ) : (
                        <MessageArea
                          status={status}
                          messages={messages}
                          lastUserElementRef={lastUserElementRef}
                          messageRefs={messageRefs}
                        />
                      )}
                      <div
                        id="spacer"
                        className={cn(
                          "flex bg-transparent transition-all ease-in-out shrink-0"
                        )}
                        style={{ height: `${dynamicSpacerHeight}px` }}
                      />
                    </div>
                  </div>
                  <BottomScrollButton
                    scrollToBottom={scrollToBottom}
                    isBottom={isBottom}
                  />
                </main>
                <UserInput
                  stop={stop}
                  session={session}
                  messages={messages}
                  status={status}
                  handleSubmit={handleSubmit}
                  model={model}
                  setModel={setModel}
                />
              </ResizablePanel>

              {isDesktop ? (
                dossierOpen && (
                  <>
                    <ResizableHandle
                      className={cn(
                        "relative overflow-visible",
                        "max-md:hidden"
                      )}
                      withHandle={false}
                      onClick={() => {}}
                    />
                    <ResizablePanel
                      defaultSize={undefined}
                      className={cn(
                        !dossierOpen && "hidden",
                        "flex flex-col h-full w-full min-w-[300px]",
                        "max-md:hidden",
                        "bg-stone-50"
                      )}
                    >
                      <Dossier messages={messages} />
                    </ResizablePanel>
                  </>
                )
              ) : (
                <MobileDossier messages={messages} />
              )}
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
      <LoginDialog />
    </>
  );
}

export const Root = memo(PureRoot);
