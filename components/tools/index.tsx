import React from "react";
import { cn } from "@/lib/utils";
import { Link, LoaderCircle, Globe, CodeXml } from "lucide-react";
import { MessageSkeleton } from "@/components/chat/message-area/message-loading-skeleton";
import { memo } from "react";

type ToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

const PureTool = (props: any) => {
  const { tool, children }: any = props;
  return (
    <div className="py-3 px-4 my-2 mx-2 border border-stone-300 rounded-md bg-neutral-100">
      {children}
    </div>
  );
};

const PureToolHeader = (props: any) => {
  const { tool, children }: any = props;
  return (
    <div className="justify-between w-full flex flex-row items-center gap-2 text-[15px] leading-6 font-semibold">
      {children || (
        <span className="flex text-stone-500 items-center gap-2 overflow-hidden max-w-full">
          {tool?.state !== "output-available" ? (
            <LoaderCircle size={16} className="!animate-spin !opacity-100 " />
          ) : (
            <CodeXml size={16} className="shrink-0" aria-hidden="true" />
          )}

          <span className="text-xs truncate">
            {tool?.type?.replace("tool-", "").toUpperCase() || "TOOL"}
          </span>
        </span>
      )}
    </div>
  );
};

const PureToolContent = (props: any) => {
  const { tool, children }: any = props;
  return (
    <>
      {(() => {
        switch (tool.state) {
          case "input-streaming":
          case "input-available":
            return <MessageSkeleton />;
          case "output-available":
            return children || <></>;
          default:
            return <></>;
        }
      })()}
    </>
  );
};

export const Tool = memo(PureTool);
export const ToolHeader = memo(PureToolHeader);
export const ToolContent = memo(PureToolContent);
