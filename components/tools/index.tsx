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
    <div className="py-3 px-4 my-2 mx-2 border border-stone-300 rounded-md bg-neutral-100">
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
