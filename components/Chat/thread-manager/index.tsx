"use client";

import { memo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import { User } from "@/components/icons/user";
import { EllipsisMenu } from "@/components/chat/thread-manager/ellipsis";
import { authClient } from "@/lib/auth-client";

export function PureThreadManager(props: any) {
  const { _id, threads, setThreads, Close, email } = props;

  return (
    /* make side bar open based on click */

    <div
      className={cn(
        "size-full",
        "relative",
        "transition-all duration-300 ease-in-out",
        "flex flex-col h-full text-black",
        "bg-neutral-100"

        //"fixed top-0 left-0"
        //"border-r border-orange-900",
        //"hover:w-[200px]"
      )}
    >
      <div
        className={cn(
          "m-1 p-1 py-5",
          "size-full flex flex-col items-center justify-start"
        )}
      >
        <div
          className={cn(
            "px-6 flex flex-row items-start justify-start text-ellipsis whitespace-nowrap",
            "w-full",
            "gap-2"
          )}
        >
          <div
            className={cn(
              "flex flex-row items-center justify-center",
              "text-xs font-semibold bg-stone-300 p-2",
              "h-12 w-12"
            )}
          >
            <User />
          </div>
          <div className={cn("flex flex-col max-size-full")}>
            <div>Hello, Puvish!</div>
            <div className="text-xs text-stone-600">How can I help you?</div>
          </div>
        </div>

        {/* Separator */}
        <hr className="flex items-center my-3 border-1 border-stone-300 w-[90%]" />

        {/* History */}
        <div
          className={cn(
            "flex flex-col items-start justify-start w-full overflow-y-auto",
            "px-6 gap-3"
          )}
        >
          <div className="text-stone-500 text-xs">History</div>
          <div
            className={cn(
              "flex flex-col w-full max-h-full overflow-y-scroll",
              "gap-2 pr-1"
            )}
          >
            {threads
              .sort((a: any, b: any) => {
                if (_id === a._id) return -1;
                if (_id === b._id) return 1;
                return Number(b.timestamp) - Number(a.timestamp);
              })
              .map(
                (h: any, i: any) =>
                  h && (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-row w-full",
                        _id === h._id && "bg-stone-200 hover:bg-stone-300"
                      )}
                    >
                      <Link
                        replace
                        href={{
                          pathname: "/chat/" + h._id!,
                        }}
                        prefetch={false}
                        className={cn(
                          "flex flex-row justify-between items-center",
                          "p-2 w-full",
                          //"bg-stone-100 hover:bg-stone-300",
                          "text-xs",
                          "overflow-hidden"
                        )}
                      >
                        <Close className="flex flex-row justify-between items-center w-full">
                          <div className="whitespace-nowrap overflow-hidden text-ellipsis text-left">
                            <div className="truncate w-full">
                              {h.title || "undefined"}
                            </div>
                            <div className="text-stone-600 text-[9px]">
                              {new Date(Number(h.timestamp)).toLocaleString() ||
                                h.timestamp}
                            </div>
                          </div>
                        </Close>
                      </Link>
                      <div className={cn("flex items-center p-1")}>
                        <EllipsisMenu
                          _id={_id}
                          targetId={h._id}
                          setThreads={setThreads}
                        >
                          <EllipsisVertical className="text-stone-400" />
                        </EllipsisMenu>
                      </div>
                    </div>
                  )
              )}
          </div>
          <div className={cn("text-stone-500 text-xs w-full text-center")}>
            All sessions
          </div>
        </div>

        {/* Separator */}
        <hr className="flex items-center my-3 border-1 border-stone-200 w-[90%]" />

        {/* Log out */}
        <div
          className={cn("flex flex-row items-center justify-center", "w-full")}
        >
          <button
            className={cn(
              "flex w-full p-2 mx-5",
              "bg-stone-700 hover:bg-stone-900",
              "text-center text-xs text-stone-300"
            )}
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = "/";
                  },
                },
              });
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export const ThreadManager = memo(PureThreadManager);
