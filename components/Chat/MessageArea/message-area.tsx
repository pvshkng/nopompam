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

type MessageAreaProps = {
  child: any;
};

// @ts-ignore
const isLast = (messages, m) => {
  return messages[messages.length - 1] === m;
};

export default function MessageArea(props: MessageAreaProps) {
  const { status } = useChat();

  const { child } = props;
  const { name, image, messages, isLoading } = props.child;
  const assistantName = "Assistant";

  // Handling Chart Visualization Panel
  // Uncomment to enable

  const [isShowGenChartBtn, setIsShowGenChartBtn] = useState(false);

  useEffect(() => {
    const msgAreaDiv = document.querySelector("#msgArea");
    if (msgAreaDiv) {
      const latestDiv = msgAreaDiv.lastElementChild;

      const containsTable = latestDiv?.querySelector("table") !== null || false;

      if (containsTable) {
        setIsShowGenChartBtn(true);
      } else {
        setIsShowGenChartBtn(false);
      }
    } else {
      return;
    }
  }, [isLoading]);

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
          {m.parts.some((p, i) => p.type === "tool-invocation") && (
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
          )}

          <div
            className={cn(
              "stream-section",

              "relative inline-block leading-6 transition-[float] rounded-2xl my-1",
              "[&>*]:text-left",

              m.role == "user"
                ? cn(
                    "max-w-[100%]",
                    "bg-gradient-to-br from-stone-300 to-stone-400 rounded-br-[0]"
                  )
                : "rounded-bl-[0] w-full"
            )}
          >
            {m.parts.map((p, j) => {
              switch (p.type) {
                case "text":
                  return (
                    <div key={`${m.id}-${j}`}>
                      <ReactMarkdown
                        className={cn(
                          "m-2 prose text-sm",
                          m.role !== "user" &&
                            isLoading &&
                            isLast(messages, m) &&
                            "typewriting",
                          m.role === "user" ? "text-neutral-700" : "text-black"
                        )}
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={components}
                      >
                        {p.text}
                      </ReactMarkdown>
                    </div>
                  );

                case "tool-invocation":
                  if (p.toolInvocation.toolName === "documentSearch") {
                    return (
                      <DocumentsReference result={p.toolInvocation.result} />
                    );
                  }
              }
            })}

            {/* Message tail tool component */}
            <ToolComponents m={m} />

            {
              <>
                {m.annotations?.map((a) => (
                  <div>ANNOTATION: {JSON.stringify(a, null, 2)}</div>
                ))}

                {/* {JSON.stringify(m, null, 2)} */}

                {/* Action Container */}
                {m.role === "assistant" && (
                  <div
                    className={cn(
                      "absolute -bottom-4 -right-0 flex flex-row gap-1"
                    )}
                  >
                    {isShowGenChartBtn && i === messages.length - 1 && (
                      <>{/* <VisualizePanel /> */}</>
                    )}

                    {/* <ActionPanel
                      isLast={isLast(messages, m)}
                      messageId={m._id}
                      message={m.content}
                    /> */}
                  </div>
                )}
              </>
            }
          </div>
        </div>
      ))}
    </div>
  );
}
