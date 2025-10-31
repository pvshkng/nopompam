import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { memo, useMemo } from "react";
import Image from "next/image";

// Message renderer
import remarkGfm from "remark-gfm";
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { components } from "@/components/markdown/markdown-component";

import { MemoizedMarkdown } from "@/components/markdown/memoized-markdown";
import { ActionPanel } from "@/components/chat-message-area/message-action-panel";
import { GradientText } from "@/components/chat-message-area/message-gradient-text";

import "@/styles/pulse.css";

// Tool components
import { Web } from "@/components/tools/web";
import { Document } from "@/components/tools/document";
import { Search } from "@/components/tools/search";

type MessageBlockProps = {
  status: string;
  m: UIMessage;
  isLast: boolean;
};

export const PureMessageBlock = (props: MessageBlockProps) => {
  const { status, m, isLast } = props;

  const markdownOptions = useMemo(
    () => ({
      remarkPlugins: m.role === "user" ? [] : [remarkGfm],
      rehypePlugins: m.role === "user" ? [] : [rehypeRaw],
      components: m.role === "user" ? {} : components,
      remarkRehypeOptions: {},
    }),
    [m.role]
  );

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

              //"after:w-0 after:h-0 after:absolute after:-bottom-2 after:right-0",
              //"after:!border-transparent after:!border-t-black/20 after:!border-r-black/20 after:border-[4px]"
            )
          : "rounded-bl-[0] w-full"
      )}
      //style={{ minHeight: isLast && m.role == "assistant" ? "30dvh" : "auto" }}
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
                  m.role === "user" ? "text-violet-700" : "text-black"
                )}
              />
            );

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
          // default:
          //   return <></>;
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
