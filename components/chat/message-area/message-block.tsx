import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { memo } from "react";

// Message renderer
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

import rehypeRaw from "rehype-raw";

import { components } from "@/components/markdown/markdown-component";
import { ActionPanel } from "@/components/chat/message-area/message-action-panel";

import "./typewriter.css";

// Tool components
import { Web } from "@/components/tools/web";
import { Document } from "@/components/tools/document";

type MessageBlockProps = {
  status: string;
  m: UIMessage;
  isLast: boolean;
};

export const PureMessageBlock = (props: MessageBlockProps) => {
  const { status, m, isLast } = props;

  return (
    <div
      className={cn(
        "relative inline-block leading-6 transition-[float] my-2",
        "[&>*]:text-left",
        m.role == "user"
          ? cn(
              "relative",
              "max-w-[80%]",
              "bg-stone-700",
              "after:w-0 after:h-0 after:absolute after:-bottom-2 after:right-0",
              "after:!border-transparent  after:!border-t-stone-700 after:!border-r-stone-700 after:border-[8px]"
            )
          : "rounded-bl-[0] w-full"
      )}
      //style={{ minHeight: isLast && m.role == "assistant" ? "30dvh" : "auto" }}
    >
      {m.parts.map((p, j) => {
        switch (p.type) {
          case "text":
            return (
              <ReactMarkdown
                key={`${m.id}-${j}`}
                className={cn(
                  "stream-section",
                  "m-2 prose text-sm",
                  m.role === "user" ? "text-stone-300" : "text-black"
                  // m.role === "assistant" &&
                  //   status !== "ready" &&
                  //   isLast &&
                  //   "typewriting"
                )}
                remarkPlugins={m.role == "user" ? [] : [remarkGfm]} //remarkMath remarkMermaidPlugin
                rehypePlugins={m.role == "user" ? [] : [rehypeRaw]} //rehypeKatex
                components={m.role == "user" ? {} : components}
                remarkRehypeOptions={{}}
              >
                {p.text}
              </ReactMarkdown>
            );

          case "tool-web":
            return (
              <div key={`tool-${m.id}-${j}`} className="flex flex-col w-full">
                <Web tool={p} />
              </div>
            );
          case "tool-document":
            return (
              <div key={`tool-${m.id}-${j}`} className="flex flex-col w-full">
                <Document tool={p} />
              </div>
            );
        }
      })}

      {m.role === "assistant" &&
        (!isLast || (isLast && status === "ready")) && (
          <ActionPanel
            status={status}
            isLast={isLast}
            messageId={m.id}
            message={m.parts.join("")}
          />
        )}
    </div>
  );
};

export const MessageBlock = memo(
  PureMessageBlock /* , (prevProps, nextProps) => {
  return (
    prevProps.m.id === nextProps.m.id && prevProps.isLast === nextProps.isLast
  );
} */
);
