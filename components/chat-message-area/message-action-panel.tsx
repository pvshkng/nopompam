"use client";

import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { memo } from "react";

function PureActionPanel(props: any) {
  const { status, messageId, message, isLast } = props;
  const strokeWidth = 1.5;
  return (
    <>
      <div
        className={cn(
          "action-panel",
          "flex flex-row item-center justify-start p-1 px-2 gap-2",
          "[&>*:hover]:-translate-y-1",
          "[&>*]:transition-all",
          "text-stone-700"
        )}
      >
        <button
          disabled={status !== "ready"}
          onClick={(e) => {
            toast("Feedback sent!", {
              classNames: {
                toast:
                  "!rounded-none border !border-stone-600 !bg-stone-700 !text-stone-200 !p-2",
              },
            });
          }}
        >
          <ThumbsUp width={18} height={18} strokeWidth={strokeWidth} />
        </button>
        <button
          disabled={status !== "ready"}
          onClick={(e) => {
            toast("Feedback sent!", {
              classNames: {
                toast:
                  "!rounded-none border !border-stone-600 !bg-stone-700 !text-stone-200 !p-2",
              },
            });
          }}
        >
          <ThumbsDown width={18} height={18} strokeWidth={strokeWidth} />
        </button>

        <button
          disabled={status !== "ready"}
          onClick={(e) => {
            window.navigator.clipboard.writeText(message);
            toast("Message copied to clipboard!", {
              classNames: {
                toast:
                  "!rounded-none border !border-stone-600 !bg-stone-700 !text-stone-200 !p-2",
              },
            });
          }}
        >
          <CopyIcon width={18} height={18} strokeWidth={strokeWidth} />
        </button>
        {isLast && (
          <button onClick={() => {}} disabled={false}>
            <RefreshCcw width={18} height={18} strokeWidth={strokeWidth} />
          </button>
        )}
      </div>
    </>
  );
}

export const ActionPanel = memo(PureActionPanel);
