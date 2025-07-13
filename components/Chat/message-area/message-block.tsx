import { cn } from "@/lib/utils";
import type { Message } from "@ai-sdk/react";
import { UIMessage } from "@ai-sdk/ui-utils";
import { memo } from "react";

// Message renderer
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { components } from "@/components/markdown/markdown-component";
import { ActionPanel } from "@/components/chat/message-area/message-action-panel";

// Tool components
import { ToolComponents } from "@/components/chat/message-area/message-tool-components";
import { ToolAnnotation } from "@/components/chat/message-area/message-tool-annotation";
import { DocumentsReference } from "@/components/tools/documents-reference";
import { ArtifactPreview } from "@/components/artifact/artifact-preview";
import { BarChartHorizontal } from "@/components/charts/bar-chart-horizontal";
import { CandlestickChart } from "@/components/charts/candle-stick-chart";

type MessageBlockProps = {
  m: UIMessage;
  isLoading?: boolean;
  artifacts: any[];
  setArtifacts: any;
  isLast: boolean;
  dossierOpen: boolean;
  setDossierOpen: boolean;
};

export const PureMessageBlock = (props: MessageBlockProps) => {
  const {
    m,
    isLoading,
    artifacts,
    setArtifacts,
    isLast,
    dossierOpen,
    setDossierOpen,
  } = props;

  return (
    <div
      className={cn(
        "stream-section",
        "relative inline-block leading-6 transition-[float] my-1",
        "[&>*]:text-left",
        m.role == "user"
          ? cn(
              "relative",
              "max-w-[80%]",
              "bg-stone-700",
              "after:w-0 after:h-0 after:absolute after:-bottom-2 after:right-0",
              "after:!border-transparent  after:!border-t-stone-700 after:!border-r-stone-700 after:border-[8px]"
              //"bg-stone-50 rounded-3xl rounded-br-none",
              //"shadow-sm"

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
                    m.role === "user" ? "text-stone-300" : "text-black"
                    // m.role !== "user" &&
                    //   isLoading &&
                    //   isLast(messages, m) &&
                    //   "typewriting",
                  )}
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeRaw, rehypeKatex]}
                  components={components}
                  remarkRehypeOptions={{}}
                >
                  {p.text}
                </ReactMarkdown>
              </div>
            );

          case "tool-invocation":
            const { toolInvocation } = p;
            const { toolName, toolCallId, state } = toolInvocation;

            switch (toolName) {
              case "createArtifact":
                return (
                  <ArtifactPreview
                    artifactId={toolCallId}
                    artifacts={artifacts}
                    setArtifacts={setArtifacts}
                    dossierOpen={dossierOpen}
                    setDossierOpen={setDossierOpen}
                  />
                );
              case "chart":
                return <CandlestickChart />;
              default:
                return (
                  <div
                    key={`tool-${m.id}-${j}`}
                    className="flex flex-col w-full"
                  >
                    <ToolAnnotation tool={toolInvocation} />
                  </div>
                );
            }

          /* if (state === "result") {
              const { result } = toolInvocation;
              const artifactId = result?.id;

              return (
                <div key={`tool-${m.id}-${j}`} className="flex flex-col w-full">
                  <ToolAnnotation tool={toolInvocation} />
                  {toolName === "createArtifact" && (
                    <ArtifactPreview
                      artifactId={toolCallId}
                      artifacts={artifacts}
                      setArtifacts={setArtifacts}
                    />
                  )}
                </div>
              );
            } */

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
            <ActionPanel
              //isLast={isLast(messages, m)}
              messageId={m.id}
              message={m.content}
            />
          )}
        </>
      }
    </div>
  );
};

export const MessageBlock = memo(PureMessageBlock);
