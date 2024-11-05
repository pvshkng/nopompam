"use client";

//import "./PseudoScroller.css";
import * as c from "@/components/Chat/_index";
import { useChatContext } from "@/components/Chat/ChatContext/ChatContext";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "../UserInput/UserInputFading.css";

export default function ChatWrapper(props: any) {
  const { name, image } = props;
  const { messages } = useChatContext();
  const containerRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const [isCurrentBottom, setIsCurrentBottom] = useState(true);
  const [isChatInitiated, setIsChatInitiated] = useState(false);

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
      <main
        id="scrollWrap"
        className="relative flex-1 flex flex-col-reverse h-full w-full overflow-y-auto overflow-x-hidden"
      >
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
            {!isChatInitiated ? (
              <></>
            ) : (
              <>
                <c.MessageArea name={name} image={image} />
              </>
            )}

            {!isChatInitiated && (
              <div
                className={cn(
                  "size-full flex items-center justify-center",
                  messages.length > 0 ? "fadeOut" : ""
                )}
              >
                <c.UserInput />
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "cursor-pointer right-1/2 translate-x-1/2 bottom-4 z-10 rounded-full bg-[#ececec] border w-8 h-8 flex items-center justify-center",
            isCurrentBottom ? "hidden" : "absolute"
          )}
          onClick={() => {
            scrollToBottom();
          }}
        >
          <Image
            src="/icon/to-bottom.svg"
            alt="arrow-downward"
            height={24}
            width={24}
          />
        </div>
      </main>
      {isChatInitiated ? (
        <div className="fadeIn">
          <c.UserInput />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
