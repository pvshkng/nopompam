import React from "react";
import { cn } from "@/lib/utils";

import { ChevronDownIcon, Link, LoaderCircle, Globe } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Suspense, useState } from "react";
import Image from "next/image";

/* 
https://vercel.com/blog/ai-sdk-5
const { messages } = useChat<MyUIMessage>();
{
  messages.map(message => (
    <>
      {message.parts.map(part => {
        switch (part.type) {
          // Static tools with specific (`tool-${toolName}`) types
          case 'tool-getWeather':
            // New states for streaming and error handling
            switch (part.state) {
              case 'input-streaming':
                // Automatically streamed partial inputs
                return <div>Getting weather for {part.input.location}...</div>;
              case 'input-available':
                return <div>Getting weather for {part.input.location}...</div>;
              case 'output-available':
                return <div>The weather is: {part.output}</div>;
              case 'output-error':
                // Explicit error state with information
                return <div>Error: {part.errorText}</div>;
            }
        }
      })}
    </>
  ));
}

*/

export const ToolAnnotation = (props: any) => {
  const { tool } = props;
  console.log("tool: ", tool);
  return (
    <>
      <Collapsible
        defaultOpen={tool?.state == "output-available"}
        className="py-3 px-4 my-2 mx-2 border border-stone-300 rounded-md bg-neutral-100"
      >
        <CollapsibleTrigger
          disabled={tool?.state !== "output-available"}
          className="justify-between w-full flex flex-row items-center gap-2 text-[15px] leading-6 font-semibold [&[data-state=open]>svg]:rotate-180"
        >
          <span className="flex items-center gap-2">
            {tool?.state !== "output-available" ? (
              <LoaderCircle
                size={16}
                className="!animate-spin !opacity-100 text-stone-500"
              />
            ) : (
              <Globe
                size={16}
                className="shrink-0 text-stone-500"
                aria-hidden="true"
              />
            )}

            <span className="text-stone-500 text-sm">
              {tool?.type?.replace("tool-", "").toUpperCase() || "TOOL"}
            </span>
          </span>
          <ChevronDownIcon
            size={16}
            className="mt-1 shrink-0 opacity-60 transition-transform duration-200"
            aria-hidden="true"
          />
        </CollapsibleTrigger>
        <CollapsibleContent
          className={cn(
            "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
            "flex flex-col overflow-hidden transition-all w-full"
          )}
        >
          {tool?.type === "tool-web" &&
            tool.output?.results?.map((item: any, i: number) => {
              return (
                <a key={i} className="text-xs mt-3" href={item?.url!}>
                  <span className="flex gap-1 mb-1 font-bold items-center overflow-hidden">
                    {item.favicon ? (
                      <img
                        src={item.favicon}
                        alt={""}
                        width={12}
                        height={12}
                        loading="eager"
                      />
                    ) : (
                      <Link className="text-stone-500 size-3" />
                    )}

                    <span className="truncate">{item.title}</span>
                  </span>
                  <span className="text-xs line-clamp-3 text-ellipsis">
                    {item.content}
                  </span>
                </a>
              );
            })}
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
