"use client";

import { cn } from "@/lib/utils";
import ActionalPanelDialog from "./ActionalPanelDialog";
import CitationBox from "./CitationBox";
import { useChatContext } from "../ChatContext/ChatContext";
import Image from "next/image";
export default function ActionPanel(props: any) {
  const { messageId, message, citation = [] } = props;

  return (
    <>
      <div
        className={cn(
          "action-panel",
          "flex flex-row item-center justify-start pt-0 pb-1 px-3 gap-2",
          //"border-[1px] border-gray-200",
          "[&>*:hover]:-translate-y-1",
          "[&>*]:transition-all"
        )}
      >
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
          <Image
            src="/icon/thumbdown.svg"
            width={18}
            height={18}
            alt="thumbdown"
          />
        </ActionalPanelDialog>

        <button onClick={()=>{}} disabled={false}>
          <Image src="/icon/refresh.svg" width={18} height={18} alt="rfresh" />
        </button>
      </div>
    </>
  );
}
