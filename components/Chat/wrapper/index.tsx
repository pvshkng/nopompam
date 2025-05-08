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

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Wrapper(props: any) {
  const router = useRouter();
  const searchParams = useSearchParams();
  let { initialMessages, _id, email, name, image } = props;
  const containerRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isCurrentBottom, setIsCurrentBottom] = useState(true);
  const [isChatInitiated, setIsChatInitiated] = useState(false);

  const {
    messages,
    isLoading,
    status,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
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

    onFinish: () => {
      !searchParams.get("_id") && router.push(`/chat?_id=${_id}`);
    },
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
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
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
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="relative flex flex-col h-full w-full overflow-y-auto overflow-x-hidden min-w-[500px]">
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
            <div
              className={cn(
                "p-1 cursor-pointer right-1/2 translate-x-1/2 bottom-0 z-10 rounded-t-md flex items-center justify-center",
                "relative bg-gradient-to-r from-neutral-800 to-stone-900",
                "border-1 border-[#302d2c] text-neutral-500 text-xs font-semibold",
                "shadow-[0_0px_20px_rgba(232,78,49,0.1)]",
                isCurrentBottom ? "hidden" : "absolute"
                //"absolute"
              )}
              onClick={() => {
                scrollToBottom();
              }}
            >
              {/* <Image
            src="/icon/to-bottom.svg"
            alt="arrow-downward"
            height={24}
            width={24}
          /> */}
              Scroll to bottom
            </div>
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
                isLoading,
                input,
                setInput,
                handleInputChange,
                handleSubmit,
              }}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle className="relative overflow-visible" withHandle />
        {/*  */}

        <ResizablePanel
          /* hidden */
          className="flex-col h-full w-full overflow-y-auto overflow-x-hidden min-w-[500px]"
        >
          <Canvas />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
