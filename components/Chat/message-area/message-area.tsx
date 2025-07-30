"use client";
import React, { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import "./message-area.css";
import "./typewriter.css";
import "./streaming-effect.css";
// import "@/lib/LaTeX/katex.min.css";
import { UIMessage } from "@ai-sdk/ui-utils";
import { MessageBlock } from "./message-block";
import { memo } from "react";
import { MessageSkeleton } from "./message-loading-skeleton";
import { LoaderCircle } from "lucide-react";
type MessageAreaProps = {
  status: string;
  name: string;
  image: string;
  messages: UIMessage[];
  isLoading: boolean;
  artifacts: any[];
  setArtifacts: Dispatch<SetStateAction<any[]>>;
  dossierOpen: boolean;
  setDossierOpen: boolean;
  activeTab: any;
  setActiveTab: any;
};

// @ts-ignore
const isLast = (messages, m) => {
  return messages[messages.length - 1] === m;
};

export default function PureMessageArea(props: MessageAreaProps) {
  const {
    status,
    name,
    image,
    messages,
    isLoading,
    artifacts,
    setArtifacts,
    dossierOpen,
    setDossierOpen,
    activeTab,
    setActiveTab,
  } = props;

  return (
    <div id="msgArea" className={cn("text-sm py-7 mb-auto")}>
      {messages.map((m, i) => (
        <div
          key={m.id}
          className={cn(
            "whitespace-normal break-words text-sm flex w-full",
            m.role == "user" ? "justify-end" : "justify-center"
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
          <MessageBlock
            status={status}
            m={m}
            isLoading={isLoading}
            artifacts={artifacts}
            setArtifacts={setArtifacts}
            isLast={isLast(messages, m)}
            dossierOpen={dossierOpen}
            setDossierOpen={setDossierOpen}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      ))}
      {status === "submitted" && <MessageSkeleton />}
    </div>
  );
}

export const MessageArea = memo(PureMessageArea);
