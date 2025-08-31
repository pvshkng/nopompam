"use client";

import { memo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { EllipsisVertical, LogOut } from "lucide-react";
import { User } from "@/components/icons/user";
import { EllipsisMenu } from "@/components/chat-thread-manager/ellipsis";
import { authClient } from "@/lib/auth-client";
import { useAuthDialogStore } from "@/lib/stores/auth-dialog-store";
import { useShallow } from "zustand/react/shallow";

export function PureThreadManager(props: any) {
  const { _id, session, threads, setThreads, Close } = props;
  const { isOpen, setIsOpen, openAuthDialog, close } = useAuthDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setIsOpen: state.setIsOpen,
      openAuthDialog: state.open,
      close: state.close,
    }))
  );
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
          "py-5",
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
              "text-xs font-semibold bg-stone-300 p-0",
              "min-h-12 min-w-12"
            )}
          >
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={"avatar"}
                width={48}
                height={48}
              />
            ) : (
              <User />
            )}
          </div>
          <div className={cn("flex flex-col h-full justify-center max-size-full overflow-hidden")}>
            <div className="font-semibold truncate">
              {session?.user?.name || "Guest"}
            </div>
            {/* Log out */}
            {session && (
              <>
                <div
                  className={cn(
                    "flex flex-row items-center justify-start"
                  )}
                >
                  <button
                    className={cn(
                      "flex flex-row items-center gap-1 py-1",
                      "text-center text-xs text-stone-700"
                    )}
                    onClick={async (e) => {
                      e.currentTarget.classList.add("animate-pulse");
                      await authClient.signOut({
                        fetchOptions: {
                          onSuccess: () => {
                            window.location.href = "/chat";
                          },
                        },
                      });
                    }}
                  >
                    <LogOut className="size-3.5 text-stone-700" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Separator */}
        <hr className="flex items-center my-3 border-1 border-stone-300 w-[90%]" />

        {/* History */}
        <div
          className={cn(
            "flex flex-col items-start justify-start w-full h-full overflow-y-auto",
            "px-6 gap-3"
          )}
        >
          {session ? (
            <>
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
                                  {new Date(
                                    Number(h.timestamp)
                                  ).toLocaleString() || h.timestamp}
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
            </>
          ) : (
            <>
              <div className="flex size-full items-center justify-center">
                <p className="text-center text-xs text-stone-500">
                  <span
                    className="underline cursor-pointer"
                    onClick={() => {
                      openAuthDialog();
                    }}
                  >
                    Login to store your conversations
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export const ThreadManager = memo(PureThreadManager);
