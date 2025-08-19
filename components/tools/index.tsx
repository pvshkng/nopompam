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
  const { children }: any = props;
  return (
    <div
      className={cn(
        "bg-black/5 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] ",
        //"before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
        //"after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none",

        "py-3 px-4 my-2 mx-2 border "
      )}
    >
      {children}
    </div>
  );
};

const PureToolHeader = (props: any) => {
  const { children, className }: any = props;
  return (
    <div className="justify-between w-full flex flex-row items-center gap-2 text-[15px] leading-6 font-semibold">
      {children}
    </div>
  );
};

const PureToolContent = (props: any) => {
  const { children }: any = props;
  return children;
};

export const Tool = memo(PureTool);
export const ToolHeader = memo(PureToolHeader);
export const ToolContent = memo(PureToolContent);
