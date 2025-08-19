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
import { useToolStore, SearchQuery } from "@/lib/stores/tool-store";
import { motion } from "framer-motion";
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
import { useInputStore } from "@/lib/stores/input-store";

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

interface DataDocument {
  id: string;
  type: "init" | "start" | "text" | "stop" | "error";
  content: any;
}

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
  const { input, setInput, clearInput } = useInputStore();

  const isDesktop = useMediaQuery("(min-width: 768px)");
  let hasStartedStreaming = false;
  const { activeTab, setActiveTab, dossierOpen, setDossierOpen } =
    useDossierStore();

  const { messages, status, sendMessage, stop } = useChat({
    //maxSteps: 5,
    experimental_throttle: 50,
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

    onFinish: ({ message }) => {},
    onData: (data) => {
      if (data.type === "data-tool-search" && data.data) {
        const searchData = data.data;
        const { toolCallId } = searchData;

        switch (searchData.type) {
          case "init":
            console.log("Initializing search tool:", searchData);
            useToolStore
              .getState()
              .initializeDraftTool(
                toolCallId,
                searchData.toolType,
                searchData.queries
              );
            break;

          case "query-complete":
            console.log("Query completed:", searchData);
            useToolStore
              .getState()
              .updateQueryStatus(
                toolCallId,
                searchData.queryId,
                "complete",
                searchData.result
              );
            break;

          case "query-error":
            console.log("Query error:", searchData);
            useToolStore
              .getState()
              .updateQueryStatus(toolCallId, searchData.queryId, "error");
            break;

          case "finalize":
            console.log("Finalizing search tool:", searchData);
            // This will clean up the draft tool since tool.output will take over
            useToolStore.getState().finalizeTool(toolCallId, searchData.output);
            break;
        }
      }

      if (data.type === "data-document" && data.data) {
        const { id, type, content } = data.data as DataDocument;
        const store = useDossierStore.getState();

        switch (type) {
          case "init":
            // Create new document
            store.addDocument({
              id: content.id,
              title: content.title,
              kind: content.kind,
              content: "",
            });
            break;

          case "start":
            // Start streaming for this document
            store.startDocumentStreaming(id);
            break;

          case "text":
            // Append content to specific document
            if (content) {
              store.appendDocumentContent(id, content);
            }
            break;

          case "stop":
            // Stop streaming for this document
            store.stopDocumentStreaming(id);
            break;

          case "error":
            // Handle error for this document
            console.error(`Error in document ${id}:`, content);
            store.stopDocumentStreaming(id);
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
    clearInput();

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
