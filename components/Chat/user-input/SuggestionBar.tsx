/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import "./SuggestionBar.css";
import { cn } from "@/lib/utils";
import React, { useRef, useEffect, useState } from "react";
import { useChatContext } from "../ChatContext/ChatContext";

function useHorizontalScroll(speed = 5) {
  const elRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = elRef.current;
    if (el) {
      const onWheel = (e: WheelEvent) => {
        if (e.deltaY == 0) return;
        e.preventDefault();
        el.scrollTo({
          left: el.scrollLeft + e.deltaY * speed,
          behavior: "auto",
        });
      };
      el.addEventListener("wheel", onWheel);
      return () => el.removeEventListener("wheel", onWheel);
    }
  }, [speed]);
  return elRef;
}

export default function SuggestionBar(props: any) {
  const { handleSend, isLoading } = useChatContext();
  const { userInput, usecase, suggestions } = props;
  const scrollRef = useHorizontalScroll();
  const [filteredSuggestion, setFilteredSuggestion] = useState<any[]>([]);
  useEffect(() => {
    const filtered = suggestions.filter((suggestion: any) =>
      suggestion.prompt.toLowerCase().includes(userInput.toLowerCase()) && suggestion.usecase.includes(usecase)
    );
    setFilteredSuggestion(filtered);
  }, [userInput, usecase, suggestions]);
  return (
    <>
      <div
        id="suggestion-bar"
        ref={scrollRef}
        className={cn(
          "flex flex-row",
          "mb-4 mx-2 p-1",
          "z-[2] mx-auto rounded-2xl bg-emerald-50 w-full max-w-[800px]",
          "shadow-[rgba(0,_0,_0,_0.3)_0px_-5px_50px]",
          "max-h-[25px] overflow-x-scroll overflow-y-hidden",
          "text-[10px] p-1",
          "suggestion-bar-in"
        )}
      >
        <div className="flex justify-start items-center">
          {filteredSuggestion && filteredSuggestion.length > 0 ? (
            <>
              {filteredSuggestion.map((s, i) => (
                <button
                  onClick={() => {
                    handleSend(s.prompt, usecase);
                  }}
                  disabled={isLoading}
                  key={i}
                  className="cursor-pointer w-full break-keep mx-1 px-1 rounded-2xl border bg-emerald-100 text-teal-800 break-none whitespace-nowrap"
                >
                  {s.prompt}
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="text-gray-300 mx-2">No suggestion</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
