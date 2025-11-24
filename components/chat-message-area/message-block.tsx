import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { memo, useMemo } from "react";
import Image from "next/image";

import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { components } from "@/components/markdown/markdown-component";

import { MemoizedMarkdown } from "@/components/markdown/memoized-markdown";
import { ActionPanel } from "@/components/chat-message-area/message-action-panel";
import { GradientText } from "@/components/chat-message-area/message-gradient-text";

import "@/styles/pulse.css";
import { File } from "lucide-react";

import { Web } from "@/components/tools/web";
import { Document } from "@/components/tools/document";
import { Search } from "@/components/tools/search";
import { Chart } from "@/components/tools/chart";

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
              "bg-black/20 backdrop-blur-sm border rounded-2xl",
              "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
              "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none",
              "rounded-br-none",
              "relative",
              "max-w-[80%]"
            )
          : "rounded-bl-[0] w-full"
      )}
    >
      {m.parts.map((p, j) => {
        switch (p.type) {
          case "text":
            return (
              <MemoizedMarkdown
                key={`${m.id}-text-${j}`}
                role={m.role}
                id={`${m.id}-${j}`}
                content={p.text}
                className={cn(
                  "stream-section",
                  "m-2 prose text-sm",
                  m.role === "user" ? "text-blue-700" : "text-black"
                )}
              />
            );
          case "file":
            if (p.mediaType?.startsWith("image/")) {
              return (
                <img
                  key={j}
                  src={p.url}
                  alt={p.filename}
                  className="max-w-full object-cover rounded-lg p-2"
                />
              );
            } else {
              return (
                <a
                  key={j}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 m-2 bg-secondary rounded my-2 hover:bg-secondary/80"
                >
                  <File className="w-4 h-4" />
                  <span className="text-sm">{p.filename}</span>
                </a>
              );
            }
          case "tool-web":
            return (
              <div key={`tool-${m.id}-${j}`} className="flex flex-col w-full">
                <Web tool={p} />
              </div>
            );
          case "tool-search":
            return (
              <div key={`tool-${m.id}-${j}`} className="flex flex-col w-full">
                <Search tool={p} />
              </div>
            );
          case "tool-chart":
            return (
              <div key={`tool-${m.id}-${j}`} className="flex flex-col w-full">
                <Chart tool={p} />
              </div>
            );
          case "tool-document":
          case "tool-createText":
          case "tool-createSheet":
          case "tool-createPython":
          case "tool-createJavascript":
          case "tool-createSql":
          case "tool-createMrm":
          case "tool-createMem":
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
      {m.role === "assistant" && isLast && status !== "ready" && (
        <>
          <div className="flex flex-row gap-2 items-center mx-4 my-1 mb-[5dvh]">
            <div className="pulse-loader flex !size-3 max-h-5 max-w-5 bg-transparent">
              <Image
                src="/avatar/furmata.png"
                height={20}
                width={20}
                alt="avatar"
                className="animate-spin rounded-full"
              />
            </div>
            <GradientText
              text="Thinking..."
              className="text-sm mx-2 font-bold"
            />
          </div>
        </>
      )}
    </div>
  );
};

export const MessageBlock = memo(PureMessageBlock, (prevProps, nextProps) => {
  return (
    prevProps.m.id === nextProps.m.id &&
    prevProps.m.parts === nextProps.m.parts &&
    prevProps.isLast === nextProps.isLast &&
    prevProps.status === nextProps.status
  );
});
