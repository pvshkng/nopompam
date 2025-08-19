import React from "react";
import { cn } from "@/lib/utils";
import { Link, LoaderCircle, NotebookPen } from "lucide-react";
import { MessageSkeleton } from "@/components/chat/message-area/message-loading-skeleton";
import { memo, useState } from "react";
import { useDossierStore } from "@/lib/stores/dossier-store";

type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

const PureDocument = (props: any) => {
  const { tool }: any = props;
  const documentId = tool?.toolCallId || tool?.id || "default";

  return (
    <>
      <div
        className={cn(
          "border border-stone-300 bg-neutral-100 rounded-md",
          "cursor-pointer py-3 px-4 my-2 mx-2"
        )}
        onClick={() => {
          const { getDocument, addDocument, switchTab } =
            useDossierStore.getState();

          // Check if document already exists
          const existingDoc = getDocument(documentId);

          if (existingDoc) {
            // Document exists, just switch to it
            switchTab(documentId);
          } else if (
            tool?.state === "output-available" &&
            tool.output?.content
          ) {
            // Create new document from completed tool output
            addDocument({
              id: documentId,
              title: tool.input?.title || "Untitled Document",
              kind: "text",
              content: tool.output.content,
            });
          }
        }}
      >
        <div className="justify-between w-full flex flex-row items-center gap-2 text-[15px] leading-6 font-semibold">
          <span className="flex text-stone-500 items-center gap-2 overflow-hidden max-w-full">
            {tool?.state !== "output-available" ? (
              <LoaderCircle size={16} className="!animate-spin !opacity-100 " />
            ) : (
              <NotebookPen size={16} className="shrink-0" aria-hidden="true" />
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
                return;
              case "output-available":
                return;
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
