"use client";

import { cn } from "@/lib/utils";
import ActionalPanelDialog from "./ActionalPanelDialog";
import CitationBox from "./CitationBox";
import { useChatContext } from "../ChatContext/ChatContext";
import Image from 'next/image'
export default function ActionPanel(props: any) {
  const { isLast, messageId, message, citation = [] } = props;
  const { handleRetry, isLoading } = useChatContext();

  return (
    <>
      <div
        className={cn(
          "action-panel",
          "flex flex-row item-center justify-center py-1 px-2 gap-2",
          "bg-stone-100 rounded-full",
          //"border-[1px] border-gray-200",
          "transition-all",
          "hover:-translate-y-1",
          "hover:shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset]",
          "[&>*:hover]:-translate-y-1",
          "[&>*]:transition-all"
        )}
      >
        {citation && citation.length > 0 && (
          <div className="flex">
            <CitationBox citation={citation}>
              <Image src="/icon/reference.svg" width={18} height={18} alt="references" />
            </CitationBox>
          </div>
        )}
        <ActionalPanelDialog
          type={"like"}
          messageId={messageId}
          message={message}
        >
          <Image src="/icon/thumbup.svg" width={18} height={18} alt="thumbup" />
        </ActionalPanelDialog>
        <ActionalPanelDialog
          type={"dislike"}
          messageId={messageId}
          message={message}
        >
          <Image src="/icon/thumbdown.svg" width={18} height={18} alt="thumbdown" />
        </ActionalPanelDialog>
        {isLast && (
          <button onClick={handleRetry} disabled={isLoading}>
            <Image src="/icon/refresh.svg" width={18} height={18} alt="refresh" />
          </button>
        )}
      </div>
    </>
  );
}
