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
//import "./MessageArea.css";
import "./Typewriter.css";
import "./StreamingEffect.css";
import "@/lib/LaTeX/katex.min.css";
import { useChat } from "@ai-sdk/react";

import {
  QueryBenefits,
  SendDocument,
  SendResignationForm,
  SendJobOpeningForm,
} from "@/lib/ai/tools";

type MessageAreaProps = {
  child: any;
};

const components: Partial<any> = {
  // @ts-ignore
  pre: ({ children, className, ...props }) => (
    <pre className={className} {...props}>
      {children}
    </pre>
  ),
  // @ts-ignore
  code: ({ node, inline, className, children }) => {
    const match = /language-(\w+)/.exec(className || "");
    if (match && match[1] === "chart") {
      return <ToolChart data={children} />;
    }

    return <code>{children}</code>;
  },
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
      {messages.map((m, i) => {
        return (
          <div
            key={i}
            className={cn(
              m.role == "user"
                ? "text-right clear-both"
                : "text-left clear-none"
            )}
          >
            {/* TOOL CALLING COMPONENT */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-200 rounded-lg">
              {/* @ts-ignore */}
              {m.toolInvocations?.map((toolInvocation) => {
                const { toolName, toolCallId, state } = toolInvocation;

                if (state === "result" && status === "ready") {
                  if (toolName === "queryBenefits") {
                    const { result } = toolInvocation;
                    return (
                      <div key={toolCallId}>
                        <QueryBenefits {...result} />
                      </div>
                    );
                  } else if (toolName === "sendDocument") {
                    const { result } = toolInvocation;
                    return (
                      <div key={toolCallId}>
                        <SendDocument {...result} />
                      </div>
                    );
                  } else if (toolName === "sendResignationForm") {
                    const { result } = toolInvocation;
                    return (
                      <div key={toolCallId} className="flex w-full">
                        <SendResignationForm {...result} />
                      </div>
                    );
                  } else if (toolName === "sendJobOpeningForm") {
                    const { result } = toolInvocation;
                    return (
                      <div key={toolCallId} className="flex w-full">
                        <SendJobOpeningForm {...result} />
                      </div>
                    );
                  }
                } else {
                  return (
                    <div key={toolCallId}>
                      <div>Loading...</div>
                    </div>
                  );
                }
              })}
            </div>

            <div
              className={cn(
                "relative inline-block leading-6 p-2 transition-[float] rounded-2xl my-3",
                "[&>*]:text-left",
                "border",
                m.role == "user"
                  ? "max-w-[100%] bg-neutral-900 rounded-br-[0] border-neutral-800 text-neutral-300 message-in-user"
                  : "bg-gradient-to-br from-orange-50 to-orange-200 rounded-bl-[0] message-in-ai"
              )}
            >
              {m.content === "" ? (
                <>{/* <div className="loader" /> */}</>
              ) : (
                <>
                  {/* <div className="group flex flex-row items-center gap-2">
                    <div
                      // check if need bg
                      className={`flex items-center justify-center ${
                        m.role === "user" ? "bg-black " : "bg-gray-200 "
                      } rounded-full min-w-8 min-h-8`}
                    >
                      <ui.Avatar>
                        <ui.AvatarImage
                          width={40}
                          height={40}
                          src={m.role === "user" ? image : "/icon/bot.svg"}
                        />
                        <ui.AvatarFallback className="font-black text-neutral-400">
                          {m.role === "user" ? name?.charAt(0) : "G"}
                        </ui.AvatarFallback>
                      </ui.Avatar>
                    </div>
                    <div className="font-semibold mr-2">
                      {m.role === "user" ? name : assistantName}
                    </div>
                  </div> */}

                  <ReactMarkdown
                    className={cn(
                      "stream-section m-2 prose text-sm",
                      m.role !== "user" &&
                        isLoading &&
                        isLast(messages, m) &&
                        "typewriting",
                      m.role === "user" ? "text-neutral-400" : "text-black"
                    )}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={components}
                  >
                    {m.content}
                  </ReactMarkdown>

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
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
