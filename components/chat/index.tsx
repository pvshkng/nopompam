"use client";

import { memo } from "react";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

import { useChat } from "@ai-sdk/react";
import { createIdGenerator, generateId, DefaultChatTransport } from "ai";
import { Dossier } from "@/components/dossier";
import { MobileDossier } from "@/components/dossier/mobile";
import { BottomScrollButton } from "@/components/chat/message-area/scroll-to-bottom";
import { Navigation } from "@/components/chat/navigation";
import { MessageArea } from "@/components/chat/message-area/message-area";
import { UserInput } from "@/components/chat/user-input";
import { LoginDialog } from "@/components/login/login-dialog";

import { handleNewThread } from "@/lib/thread/new-thread-handler";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { toast } from "sonner";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useMediaQuery } from "@/hooks/use-media-query";
import { useDossierStore } from "@/lib/stores/dossier-store";

type PureRootProps = {
  initialMessages: any[];
  initialThreads: any[];
  initialArtifacts: any[];
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

type DataDocument = {
  id: string;
  type: "text" | "kind" | "title" | "clear";
  content: string;
};

function PureRoot(props: PureRootProps) {
  let {
    initialMessages,
    initialThreads,
    initialArtifacts,
    _id,
    session,
    email,
    name,
    image,
  } = props;
  const params = useParams();
  const { containerRef, isBottom, scrollToBottom, handleScroll } =
    useScrollToBottom();
  const [model, setModel] = useState("gemini-2.5-flash");
  const [threads, setThreads] = useState<Thread[]>(initialThreads || []);
  const [input, setInput] = useState("");

  const isDesktop = useMediaQuery("(min-width: 768px)");
  let hasStartedStreaming = false;
  const {
    activeTab,
    setActiveTab,
    dossierOpen,
    setDossierOpen,
    openDossier,
    setIsStreaming,
    appendStreamingContent,
    clearStreamingContent,
  } = useDossierStore();

  const { messages, status, sendMessage } = useChat({
    //maxSteps: 5,
    transport: new DefaultChatTransport({
      api: "/api/chat",
      credentials: "include",
      // headers: { "Custom-Header": "value" },
    }),
    id: _id,
    messages: initialMessages,
    generateId: createIdGenerator({
      prefix: "msgc",
      size: 16,
    }),

    onFinish: ({ message }) => {
      console.log("Stream finished");
      hasStartedStreaming = false;
      useDossierStore.getState().setIsStreaming(false);

      // Log final content
      const finalContent = useDossierStore.getState().streamingContent;
      console.log("Final content:", {
        length: finalContent.length,
        content: finalContent,
      });
    },
    onData: (data) => {
      console.log("Chat data received:", data);

      if (data.type === "data-document" && data.data) {
        const { id, type, content } = data.data as DataDocument;

        switch (type) {
          case "text":
            // Only clear and setup on the very first chunk
            if (!hasStartedStreaming) {
              console.log("Starting fresh document stream");
              hasStartedStreaming = true;

              if (!useDossierStore.getState().dossierOpen) {
                useDossierStore.getState().openDossier("documents");
              }

              useDossierStore.getState().clearStreamingContent();
              useDossierStore.getState().setIsStreaming(true);
            }

            // Always append content
            if (content) {
              console.log("Appending chunk:", {
                chunk: content,
                chunkLength: content.length,
              });
              useDossierStore.getState().appendStreamingContent(content);

              // Log current total content
              const currentContent =
                useDossierStore.getState().streamingContent;
              console.log("Current total content:", {
                length: currentContent.length,
                preview: currentContent.substring(0, 50) + "...",
              });
            }
            break;
        }
      }

      try {
        if (data.type === "data-title") {
          console.log("Creating new thread with title: ", data.data!.title);
          handleNewThread({
            data,
            _id,
            email,
            setThreads,
            params,
          });
        }
      } catch (error) {
        console.error("Error handling thread data:", error);
      }
    },
    onError: (e) => {
      console.error("Chat error:", e);
      toast(e.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;

    const messageText = input.trim();
    setInput("");

    try {
      sendMessage(
        { text: messageText },
        {
          body: {
            session: session,
            user: session?.user?.email || undefined,
            model: model,
          },
        }
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setInput(messageText);
      toast("Failed to send message");
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full bg-transparent">
        <Navigation
          _id={_id}
          session={session}
          threads={threads}
          setThreads={setThreads}
        />
        <div className="flex flex-row size-full overflow-hidden">
          <div
            className={cn(
              "relative flex h-full w-full min-w-[400px]",
              "flex-1 flex-col overflow-hidden",
              "shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            )}
          >
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel className="relative flex flex-col h-full w-full overflow-y-auto overflow-x-hidden min-w-[350px]">
                <main className="relative flex-1 flex flex-col-reverse h-full w-full overflow-y-auto overflow-x-hidden">
                  <div
                    ref={containerRef}
                    onScroll={handleScroll}
                    id="scrollArea"
                    className="relative flex flex-col-reverse items-center h-full w-full overflow-y-scroll overflow-x-hidden scroll-smooth"
                  >
                    <div
                      id="wrapper"
                      className="flex flex-col-reverse mx-auto px-6 bg-transparent h-full w-full max-w-[800px] text-black"
                    >
                      {messages.length === 0 ? (
                        <></>
                      ) : (
                        <>
                          <MessageArea
                            status={status}
                            name={name!}
                            image={image!}
                            messages={messages}
                            dossierOpen={dossierOpen}
                            // @ts-ignore
                            setDossierOpen={setDossierOpen}
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <BottomScrollButton
                    scrollToBottom={scrollToBottom}
                    isBottom={isBottom}
                  />
                </main>
                <UserInput
                  session={session}
                  messages={messages}
                  status={status}
                  input={input}
                  setInput={setInput}
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
                      <Dossier />
                    </ResizablePanel>
                  </>
                )
              ) : (
                <MobileDossier />
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
