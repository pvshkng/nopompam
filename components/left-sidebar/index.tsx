"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

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
        opn ? "w-[200px]" : "w-[20px]",
        "relative z-40",
        "transition-all duration-300 ease-in-out",
        "flex flex-col h-full text-black",
        "opacity-50 backdrop-blur-lg"
        //"border-r border-orange-900",
        //"hover:w-[200px]"
      )}
    >
      <div className="z-[1000] fixed top-8 -right-4 rounded-sm bg-stone-500">
        <button
          onClick={() => {
            setOpn(!opn);
          }}
          className=""
        >
          open
        </button>
      </div>
    </div>
  );
}
