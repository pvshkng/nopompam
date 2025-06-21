import { cn } from "@/lib/utils";
import type { Message } from "@ai-sdk/react";
import { UIMessage } from "@ai-sdk/ui-utils";

// Message renderer
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { components } from "@/components/markdown/markdown-component";

// Tool components
import { ToolComponents } from "./message-tool-components";
import { ToolAnnotation } from "./message-tool-annotation";
import { DocumentsReference } from "@/components/tools/documents-reference";

type MessageBlockProps = {
  m: UIMessage;
  isLoading?: boolean;
};
export const MessageBlock = (props: MessageBlockProps) => {
  const { m, isLoading } = props;

  return (
    <div
      className={cn(
        "stream-section",
        "relative inline-block leading-6 transition-[float] my-1",
        "[&>*]:text-left",
        m.role == "user"
          ? cn(
              "max-w-[100%]",
              "border border-stone-700 bg-stone-700"
              //"bg-gradient-to-br from-stone-300 to-stone-400 rounded-br-[0]"
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
                    m.role === "user" ? "text-stone-200" : "text-black"
                    // m.role !== "user" &&
                    //   isLoading &&
                    //   isLast(messages, m) &&
                    //   "typewriting",
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
            return (
              <div key={`tool-${m.id}-${j}`} className="flex flex-col w-full">
                <ToolAnnotation tool={p.toolInvocation} />{" "}
              </div>
            );
          // if (
          //   p.toolInvocation.toolName === "documentSearch" &&
          //   "result" in p.toolInvocation &&
          //   p.toolInvocation.result
          // ) {
          //   return <DocumentsReference result={p.toolInvocation.result} />;
          // }
        }
      })}

      {/* Message tail tool component */}
      {/* <ToolComponents m={m} /> */}

      {
        <>
          {/* {m.annotations?.map((a) => (
                          <div>ANNOTATION: {JSON.stringify(a, null, 2)}</div>
                        ))} */}

          {/* {JSON.stringify(m, null, 2)} */}

          {/* Action Container */}
          {m.role === "assistant" && (
            <div
              className={cn("absolute -bottom-4 -right-0 flex flex-row gap-1")}
            >
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
  );
};
