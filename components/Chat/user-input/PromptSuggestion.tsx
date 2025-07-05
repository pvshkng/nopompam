"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/_index";
import { cn } from "@/lib/utils";
import { useState } from "react";

const options = [
  { value: "on", label: "On" },
  { value: "off", label: "Off" },
];

export default function PromptSuggestion(props: any) {
  const { setIsSuggested } = props;

  return (
    <>
      <div className="flex flex-row items-center">
        <div className="mx-1 text-[10px] text-gray-500 font-semibold">
          Suggestion:
        </div>
        <Tabs
          defaultValue="off"
          onValueChange={(v) => {
            setIsSuggested((prev: boolean) => !prev);
          }}
        >
          <TabsList className="h-auto bg-transparent my-1 p-0">
            {options.map((o, i) => (
              <TabsTrigger
                className={cn(
                  "text-[10px] mx-[2px] p-1",
                  "data-[state=active]:bg-bean",
                  " text-gray-300 data-[state=active]:text-gray-500",
                  "leading-none"
                )}
                value={o.value}
                key={i}
              >
                {o.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </>
  );
}
