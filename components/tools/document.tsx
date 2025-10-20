import React from "react";
import { cn } from "@/lib/utils";
import { Link, LoaderCircle, NotebookPen } from "lucide-react";
import { MessageSkeleton } from "@/components/chat-message-area/message-loading-skeleton";
import { memo, useState } from "react";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { getArtifact } from "@/lib/mongo/artifact-store";
import type { ToolUIPart } from "ai";

type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

type DocumentOutput = {
  id: string;
  title: string;
  content: string;
  kind: string;
};

const PureDocument = (props: any) => {
  const { tool }: { tool: ToolUIPart } = props;
  const document = tool?.output as DocumentOutput;
  const documentId = document?.id;
  const { getDocument, addDocument, switchTab } = useDossierStore.getState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <div
        className={cn(
          "border border-violet-300 bg-neutral-100 rounded-md",
          "cursor-pointer py-3 px-4 my-2 mx-2"
        )}
        onClick={async () => {
          if (isLoading) return;

          const existingDoc = getDocument(documentId);
          if (existingDoc) {
            switchTab(documentId);
            return;
          }

          if (tool?.state === "output-available" && document?.content) {
            try {
              setIsLoading(true);
              const artifact = await getArtifact(documentId);
              addDocument({
                id: artifact.artifactId,
                title: artifact.title || "Untitled Document",
                kind: artifact.kind || "text",
                content: artifact.content,
              });
              switchTab(artifact.artifactId);
            } catch (error) {
              console.error("Error adding document:", error);
            } finally {
              setIsLoading(false);
            }
          }
        }}
      >
        <div className="justify-between w-full flex flex-row items-center gap-2 text-[15px] leading-6 font-semibold">
          <span className="flex text-violet-500 items-center gap-2 overflow-hidden max-w-full">
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
