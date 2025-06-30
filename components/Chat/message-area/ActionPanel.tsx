"use client";

import { cn } from "@/lib/utils";
import ActionalPanelDialog from "./ActionalPanelDialog";
import CitationBox from "./CitationBox";
import { useChatContext } from "../ChatContext/ChatContext";
import Image from "next/image";
import { ThumbsUp, ThumbsDown, CopyIcon, RefreshCcw } from "lucide-react";
export default function ActionPanel(props: any) {
  const { messageId, message, citation = [] } = props;
  const strokeWidth = 1.5;
  return (
    <>
      <div
        className={cn(
          "action-panel",
          "flex flex-row item-center justify-start p-1 px-2 gap-2",
          //"border-[1px] border-gray-200",
          "[&>*:hover]:-translate-y-1",
          "[&>*]:transition-all",
          "text-stone-700"
        )}
      >
        <ActionalPanelDialog
          type={"like"}
          messageId={messageId}
          message={message}
        >
          <ThumbsUp width={18} height={18} strokeWidth={strokeWidth} />
        </ActionalPanelDialog>
        <ActionalPanelDialog
          type={"dislike"}
          messageId={messageId}
          message={message}
        >
          <ThumbsDown width={18} height={18} strokeWidth={strokeWidth} />
        </ActionalPanelDialog>

        <button onClick={() => {}} disabled={false}>
          <CopyIcon width={18} height={18} strokeWidth={strokeWidth} />
        </button>
        <button onClick={() => {}} disabled={false}>
          <RefreshCcw width={18} height={18} strokeWidth={strokeWidth} />
        </button>
      </div>
    </>
  );
}
