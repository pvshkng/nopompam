import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { memo, useMemo } from "react";
import Image from "next/image";

// Message renderer
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
// import remarkMath from "remark-math";
// import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { components } from "@/components/markdown/markdown-component";

import { MemoizedMarkdown } from "@/components/markdown/memoized-markdown";
import { ActionPanel } from "@/components/chat/message-area/message-action-panel";
import { GradientText } from "@/components/chat/message-area/message-gradient-text";

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
              <MemoizedMarkdown
                key={`${m.id}-text-${j}`}
                role={m.role}
                id={`${m.id}-${j}`}
                content={p.text}
                className={cn(
                  "stream-section",
                  "m-2 prose text-sm",
                  m.role === "user" ? "text-stone-300" : "text-black"
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
          <div className="flex flex-row gap-2 items-center mx-4 my-1">
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
