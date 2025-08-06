import React from "react";
import { cn } from "@/lib/utils";
import { Link, LoaderCircle, Globe } from "lucide-react";
import { MessageSkeleton } from "@/components/chat/message-area/message-loading-skeleton";
import { memo, useState } from "react";
import { useDocumentStream } from "@/lib/context/document-context";

type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

const PureDocument = (props: any) => {
  //tool.type =
  const { tool }: any = props;
  const documentId = tool?.toolCallId || tool?.id || "default";
  //const document = useDocumentStream(documentId);

  return (
    <>
      <div
        //defaultOpen={tool?.state == "output-available"}
        className="py-3 px-4 my-2 mx-2 border border-stone-300 rounded-md bg-neutral-100"
      >
        <div className="justify-between w-full flex flex-row items-center gap-2 text-[15px] leading-6 font-semibold">
          <span className="flex text-stone-500 items-center gap-2 overflow-hidden max-w-full">
            {tool?.state !== "output-available" ? (
              <LoaderCircle size={16} className="!animate-spin !opacity-100 " />
            ) : (
              <Globe size={16} className="shrink-0" aria-hidden="true" />
            )}

            <span className="text-xs truncate">
              {tool?.type?.replace("tool-", "").toUpperCase() || "DOCUMENT"}
              {(tool.input?.title! &&
                " · " + tool.input?.title?.toUpperCase()) ||
                ""}
            </span>
          </span>
        </div>

        {/* Content */}
        <>
          {(() => {
            switch (tool.state) {
              case "input-streaming":
                return <MessageSkeleton />;
              case "input-available":
                return <div>{"document"}</div>;
              case "output-available":
                return (
                  <>
                    <div
                      className={cn(
                        "flex flex-col overflow-hidden transition-all w-full"
                      )}
                    >
                      {tool.output && JSON.stringify(tool.output)}
                    </div>
                  </>
                );
              default:
                return <></>;
            }
          })()}
        </>
      </div>
    </>
  );
};

export const Document = memo(PureDocument);
