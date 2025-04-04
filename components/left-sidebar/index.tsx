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
      className={cn(
        "relative",
        "transition-all duration-300 ease-in-out",
        opn ? "w-[200px]" : "w-[30px]",
        "z-10 flex flex-col h-full text-white",
        "bg-zinc-900 backdrop-blur-lg"
        //"border-r border-orange-900",
        //"hover:w-[200px]"
      )}
    >
      <button
        onClick={() => {
          setOpn(!opn);
          console.log(opn);
        }}
        className=""
      >
        open
      </button>
    </div>
  );
}
