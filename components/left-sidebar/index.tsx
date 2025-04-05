"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { PlusCircleIcon } from "@/components/icons/plus-circle";
import { SidebarIcon } from "@/components/icons/sidebar";
import { User } from "@/components/icons/user";
import { DeleteIcon } from "@/components/icons/delete";

const history = [
  {
    text: "Hello, how can I help you?",
    date: "2023-10-01",
  },
  {
    text: "What is your name?",
    date: "2023-10-02",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from?",
    date: "2023-10-03",
  },
  {
    text: "Where are you from??",
    date: "2023-10-03",
  },
];
export function LeftSidebar() {
  const [opn, setOpn] = useState(true);

  function handleOpen() {
    setOpn(true);
  }
  return (
    /* make side bar open based on click */

    <div
      onClick={() => {
        !opn && setOpn(true);
      }}
      className={cn(
        opn ? "w-[300px]" : "w-[20px]",
        "relative z-40",
        "transition-all duration-300 ease-in-out",
        "flex flex-col h-full text-black"
        //"fixed top-0 left-0"
        //"border-r border-orange-900",
        //"hover:w-[200px]"
      )}
    >
      {/* Background */}
      {/* <div className="absolute flex size-full bg-stone-400 opacity-75"/> */}

      {/* Toggler */}
      <div
        onClick={() => {
          setOpn(!opn);
        }}
        className={cn(
          "group relative",
          "cursor-pointer z-[1000] absolute top-8 -right-5",
          "flex flex-row items-start justify-start p-2",
          "rounded-full bg-stone-500",
          "opacity-70",
          "shadow-lg"
        )}
      >
        <SidebarIcon />
        {/* <div
            className={cn(
              "transition-all duration-300 ease-in-out",
              "text-xs",
              "hidden opacity-0 group-hover:opacity-100 group-hover:flex"
            )}
          >
            Toggle
          </div> */}
      </div>

      {/* Content */}
      <div
        className={cn(
          "transition-all duration-300 overflow-hidden",
          opn ? "" : "hidden opacity-0",
          //"bg-red-500",
          "m-1 my-9 p-1",
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
              "text-xs font-semibold bg-stone-300 rounded-lg p-2",
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
              "gap-2"
            )}
          >
            {history.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "flex flex-row justify-between items-center",
                  "p-2 rounded-md w-full",
                  "bg-stone-200 hover:bg-stone-300",
                  "text-xs",
                  "cursor-pointer"
                )}
              >
                <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                  <div>{h.text}</div>
                  <div className="text-stone-600">{h.date}</div>
                </div>
                <button
                  className={cn(
                    "relative overflow-hidden",
                    "flex items-center bg-stone-300 hover:bg-stone-200 rounded-md p-1"
                  )}
                >
                  <DeleteIcon />
                  {/* <div
                className={cn(
                  "absolute flex w-[100px] rounded-md p-1 top-0 right-0 left-0 bottom-0",
                  "bg-red-400 hover:bg-red-500",
                )}
              >
                Confirm?
              </div> */}
                </button>
              </div>
            ))}
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
              "flex w-full p-2 mx-5 rounded-lg",
              "bg-stone-200 hover:bg-stone-100 border-2 border-stone-300",
              "text-center"
            )}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
