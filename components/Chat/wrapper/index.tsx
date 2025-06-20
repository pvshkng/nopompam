"use client";

import * as c from "@/components/Chat/_index";
import { useChatContext } from "@/components/Chat/ChatContext/ChatContext";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "../UserInput/UserInputFading.css";
import { useChat } from "@ai-sdk/react";
import { createIdGenerator, generateId } from "ai";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { LeftSidebar } from "@/components/left-sidebar";
import { Canvas } from "@/components/canvas";
import { BottomScrollButton } from "@/components/Chat/MessageArea/scroll-to-bottom";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

// TODO: to rename to ChatRoot
export default function Wrapper(props: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  let {
    initialMessages,
    _id,
    email,
    name,
    image,
    loadedArtifacts = [],
  } = props;
  const containerRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isCurrentBottom, setIsCurrentBottom] = useState(true);
  const [isChatInitiated, setIsChatInitiated] = useState(false);
  const [canvasSwapped, isCanvasSwapped] = useState(false);
  const [canvasOpened, isCanvasOpened] = useState(true);
  const [artifacts, setArtifacts] = useState(loadedArtifacts);
  const [streamData, setStreamData] = useState<any[]>([]);
  const [sidebarToggled, setSidebarToggled] = useState(true);
  const [threads, setThreads] = useState([]);

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
    },

    onFinish: (messages) => {
      if (!searchParams.get("_id")) {
        router.replace(`/chat?_id=${_id}`);
        const title = messages.annotations?.[0]?.title || "New Chat";
        const newThread = {
          _id: _id,
          user: email,
          title: title,
          timestamp: "Just now",
        };
        setThreads((prevThreads) => [newThread, ...prevThreads]);
      }
    },
    streamProtocol: "data",
  });

  useEffect(() => {
    if (isScrolledToBottom) {
      scrollToBottom();
    }
  }, [messages, isScrolledToBottom]);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => {
        setIsChatInitiated(true);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight!;
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
      <LeftSidebar
        /* threads={threads} */
        email={email}
        sidebarToggled={sidebarToggled}
        setSidebarToggled={setSidebarToggled}
        threads={threads}
        setThreads={setThreads}
      />

      <div
        className={cn(
          "relative flex h-full w-full min-w-[400px]",
          "flex-1 flex-col overflow-hidden rounded-tl-2xl",
          "bg-white border-2 border-gray-300",
          "shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
        )}
      >
        {/* Overlay */}
        <div
          onClick={() => {
            sidebarToggled && setSidebarToggled(false);
          }}
          className={cn(
            "pointer-events-none",
            sidebarToggled &&
              "max-sm:backdrop-blur-sm max-sm:bg-white/10 max-sm:!cursor-pointer max-sm:!pointer-events-auto",
            "z-10 transition-all delay-100 absolute flex size-full"
          )}
        />
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel className="relative flex flex-col h-full w-full overflow-y-auto overflow-x-hidden min-w-[100px]">
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
                      <c.MessageArea
                        child={{
                          name,
                          image,
                          messages,
                          isLoading,
                        }}
                      />
                    </>
                  )}

                  {/* {!isChatInitiated && (
              <div
                className={cn(
                  "size-full flex items-center justify-center",
                  messages.length > 0 ? "fadeOut" : ""
                )}
              >
                <c.UserInput child={{}} />
              </div>
            )} */}
                </div>
              </div>
              <BottomScrollButton
                scrollToBottom={scrollToBottom}
                isCurrentBottom={isCurrentBottom}
              />
            </main>
            <div
              className={
                /* Styling */
                !isChatInitiated && messages.length === 0
                  ? cn(
                      "size-full flex items-center justify-center",
                      messages.length > 0 ? "fadeOut" : ""
                    )
                  : "fadeIn"
              }
            >
              <c.UserInput
                child={{
                  messages,
                  status,
                  isLoading,
                  input,
                  setInput,
                  handleInputChange,
                  handleSubmit,
                  canvasOpened,
                  isCanvasOpened,
                }}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle
            /* hidden */
            className={cn(
              !canvasOpened && "hidden",
              "relative overflow-visible"
            )}
            withHandle
            onClick={() => {}}
          />

          <ResizablePanel
            /* hidden */

            className={cn(
              !canvasOpened && "hidden",
              "flex-col h-full w-full overflow-y-auto overflow-x-hidden min-w-[100px]"
            )}
          >
            <Canvas
              canvasOpened={canvasOpened}
              isCanvasOpened={isCanvasOpened}
              artifacts={artifacts}
              setArtifacts={setArtifacts}
            />
          </ResizablePanel>
        </ResizablePanelGroup>{" "}
      </div>
    </>
  );
}
