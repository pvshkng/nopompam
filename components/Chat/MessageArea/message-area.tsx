"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { useChatContext } from "@/components/Chat/ChatContext/ChatContext";
import ActionPanel from "./ActionPanel";
import ReactMarkdown from "react-markdown";
import { ToolChart } from "./Charts/Charts";
import { useState, useEffect } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import * as ui from "@/components/ui/_index";
import VisualizePanel from "./VisualizePanel";
import "./message-area.css";
import "./typewriter.css";
import "./streaming-effect.css";
import "@/lib/LaTeX/katex.min.css";
import { useChat } from "@ai-sdk/react";
import { components } from "@/components/markdown/markdown-component";
import { ToolComponents } from "./message-tool-components";
import { ToolAnnotation } from "./message-tool-annotation";
import { DocumentsReference } from "@/components/tools/documents-reference";
import { generateId } from "ai";
import { UIMessage } from "@ai-sdk/ui-utils";
import { MessageBlock } from "./message-block";

type MessageAreaProps = {
  name: string;
  image: string;
  messages: UIMessage[];
  isLoading: boolean;
};

// @ts-ignore
const isLast = (messages, m) => {
  return messages[messages.length - 1] === m;
};

export default function MessageArea(props: MessageAreaProps) {
  const { name, image, messages, isLoading } = props;

  return (
    <div id="msgArea" className={cn("text-sm py-7 mb-auto")}>
      {messages.map((m, i) => (
        <div
          key={m.id}
          className={cn(
            "whitespace-normal break-words text-sm",
            m.role == "user" ? "text-right clear-both" : "text-left clear-none"
          )}
        >
          {/* Tool Annotation */}
          {/* {m.parts.some((p, i) => p.type === "tool-invocation") && (
            <div key={generateId(5)} className="flex flex-col gap-1 my-2">
              {m.parts.map((p, k) => (
                <>
                  {p.type === "tool-invocation" &&
                    (!isLoading || i !== m.length - 1) && (
                      <div
                        key={`tool-${m.id}-${k}`}
                        className="flex flex-col w-full"
                      >
                        <ToolAnnotation tool={p.toolInvocation} />
                      </div>
                    )}
                </>
              ))}
            </div>
          )} */}

          <MessageBlock m={m} isLoading={isLoading} />
        </div>
      ))}
    </div>
  );
}
