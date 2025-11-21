"use client";
import React, { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import "@/styles/message-area.css";
import "@/styles/typewriter.css";
import "@/styles/streaming-effect.css";
import "@/lib/LaTeX/katex.min.css";
import { UIMessage } from "ai";
import { MessageBlock } from "./message-block";
import { memo } from "react";

type MessageAreaProps = {
  status: string;
  messages: UIMessage[];
  lastUserElementRef: React.RefObject<HTMLDivElement | null> | null;
  messageRefs: React.RefObject<Record<string, HTMLDivElement>> | null;
  
};

export default function PureMessageArea(props: MessageAreaProps) {
  const { status, messages, lastUserElementRef, messageRefs } = props;
  const lastUserMessageIndex = messages.findLastIndex((m) => m.role === "user");

  return (
    <>
      {/* <div id="msgArea" className={cn("text-sm py-7")}> */}
      {messages.map((m, i) => {
        return (
          <div
            key={m.id}
            className={cn(
              "whitespace-normal break-words text-sm flex w-full",
              m.role == "user" ? "justify-end" : "justify-center"
            )}
            ref={(el) => {
              if (el) {
                messageRefs.current[m.id] = el;
              }

              if (i === lastUserMessageIndex) {
                lastUserElementRef.current = el;
              }
            }}
          >
            <MessageBlock
              status={status}
              m={m}
              isLast={i === messages.length - 1}
            />
          </div>
        );
      })}
      {/* </div> */}
    </>
  );
}

export const MessageArea = memo(PureMessageArea);
