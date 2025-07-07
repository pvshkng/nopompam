"use client";

import { memo } from "react";
import { useChatContext } from "@/components/chat/ChatContext/ChatContext";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

import { useChat } from "@ai-sdk/react";
import { createIdGenerator, generateId } from "ai";
import { useSearchParams } from "next/navigation";
import { Canvas } from "@/components/canvas";
import { MobileCanvas } from "@/components/canvas/mobile";
import { BottomScrollButton } from "@/components/chat/message-area/scroll-to-bottom";
import { Navigation } from "@/components/chat/navigation";
import { MessageArea } from "@/components/chat/message-area/message-area";
import { UserInput } from "@/components/chat/user-input/UserInput";

import { artifactStreamHandler } from "@/lib/artifacts/handler";
import { handleNewThread } from "@/lib/thread/new-thread-handler";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useMediaQuery } from "@/hooks/use-media-query";

// TODO: to rename to ChatRoot
function PureWrapper(props: any) {
  const searchParams = useSearchParams();
  let {
    initialMessages,
    initialThreads,
    initialArtifacts,
    _id,
    email,
    name,
    image,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isCurrentBottom, setIsCurrentBottom] = useState(true);
  const [isChatInitiated, setIsChatInitiated] = useState(false);
  const [canvasSwapped, isCanvasSwapped] = useState(false);
  const [canvasOpened, isCanvasOpened] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [streamData, setStreamData] = useState<any[]>([]);
  const [sidebarToggled, setSidebarToggled] = useState(true);
  const [artifacts, setArtifacts] = useState(initialArtifacts);
  const [tabs, setTabs] = useState(initialArtifacts);
  const [model, setModel] = useState("gemini-2.5-pro");
  // to do centralize this type
  type Thread = {
    _id: any;
    user: any;
    title: any;
    timestamp: string;
  };
  const [threads, setThreads] = useState<Thread[]>(initialThreads || []);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const {
    messages,
    isLoading,
    status,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    data,
    setData,
  } = useChat({
    id: _id,
    initialMessages: initialMessages,
    sendExtraMessageFields: true,
    generateId: createIdGenerator({
      prefix: "msgc",
      size: 16,
    }),
    body: {
      user: email,
      model: "gemini-2.5-pro",
    },

    onFinish: (messages) => {
      if (!searchParams.get("_id")) {
        handleNewThread({
          messages,
          _id,
          email,
          setThreads,
        });
      }
    },

    streamProtocol: "data",
  });

  const lastDataIndex = useRef(0);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const reducedArtifacts = data.reduce(
      // @ts-ignore
      (acc, item) => artifactStreamHandler(item, acc),
      []
    );
    setArtifacts(reducedArtifacts);

    setData([]);
  }, [data]);

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages, isScrolledToBottom]);

  /*   useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        setIsChatInitiated(true);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [messages.length]); */

  useEffect(() => {
    console.log("model: ", model);
  }, [model, setModel]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop! = containerRef.current.scrollHeight!;
    }
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
      setIsScrolledToBottom(isBottom);
      setIsCurrentBottom(scrollTop >= 0);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full w-full bg-neutral-100">
        <Navigation
          email={email}
          sidebarToggled={sidebarToggled}
          setSidebarToggled={setSidebarToggled}
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
                      {!isChatInitiated && messages.length === 0 ? (
                        <></>
                      ) : (
                        <>
                          <MessageArea
                            name={name}
                            image={image}
                            messages={messages}
                            isLoading={isLoading}
                            artifacts={artifacts}
                            setArtifacts={setArtifacts}
                            canvasOpened={canvasOpened}
                            // @ts-ignore
                            isCanvasOpened={isCanvasOpened}
                          />
                        </>
                      )}
                    </div>
                  </div>
                  <BottomScrollButton
                    scrollToBottom={scrollToBottom}
                    isCurrentBottom={isCurrentBottom}
                  />
                </main>

                <UserInput
                  messages={messages}
                  status={status}
                  isLoading={isLoading}
                  input={input}
                  setInput={setInput}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  canvasOpened={canvasOpened}
                  isCanvasOpened={isCanvasOpened}
                  isDrawerOpen={isDrawerOpen}
                  setIsDrawerOpen={setIsDrawerOpen}
                  model={model}
                  setModel={setModel}
                />
              </ResizablePanel>

              <ResizableHandle
                /* hidden */
                className={cn(
                  //!canvasOpened && "hidden",
                  "relative overflow-visible",
                  "max-md:hidden"
                )}
                withHandle={false}
                onClick={() => {}}
              />

              <ResizablePanel
                /* hidden */

                className={cn(
                  !canvasOpened && "hidden",
                  "flex flex-col h-full w-full max-h-full overflow-y-hidden overflow-x-hidden min-w-[300px]",
                  "bg-white",
                  "items-start justify-start",
                  "max-md:hidden"
                )}
              >
                {isDesktop ? (
                  <Canvas
                    canvasOpened={canvasOpened}
                    isCanvasOpened={isCanvasOpened}
                    artifacts={artifacts}
                    setArtifacts={setArtifacts}
                    tabs={tabs}
                    setTabs={setTabs}
                  />
                ) : (
                  <MobileCanvas
                    /* className="md:hidden" */
                    isDrawerOpen={isDrawerOpen}
                    setIsDrawerOpen={setIsDrawerOpen}
                  />
                )}
              </ResizablePanel>
            </ResizablePanelGroup>{" "}
          </div>
        </div>
      </div>
    </>
  );
}

export const Wrapper = memo(PureWrapper);
