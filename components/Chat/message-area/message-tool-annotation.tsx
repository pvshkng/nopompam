import React from "react";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  CircleCheckIcon,
  TriangleAlertIcon,
  RefreshCwIcon,
  XIcon,
} from "lucide-react";

import {
  AtSignIcon,
  ChevronDownIcon,
  CircleDashedIcon,
  CommandIcon,
  EclipseIcon,
  GaugeIcon,
  LucideIcon,
  ZapIcon,
  Globe,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Suspense, useState } from "react";

export const ToolAnnotation = (props: any) => {
  const { tool } = props;
  return (
    <>
      <Collapsible
        className="py-3 my-2 px-4 border border-stone-300 rounded-md bg-neutral-100 opacity-50"
      >
        <CollapsibleTrigger className="justify-between w-full flex flex-row items-center gap-2 text-[15px] leading-6 font-semibold [&[data-state=open]>svg]:rotate-180">
          <span className="flex items-center gap-3">
            {tool?.state !== "result" ? (
              <div
                className="spinner w-[24px] h-[24px] border-4 border-stone-300 border-t-stone-800 rounded-full"
                //style={{ animation: "spin 1s linear infinite" }}
              />
            ) : (
              <Globe
                size={16}
                className="shrink-0 text-stone-500"
                aria-hidden="true"
              />
            )}

            <span className="text-stone-500 text-sm">
              {tool?.toolName?.toUpperCase() || "TOOL"}
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
            "flex flex-col overflow-hidden transition-all"
          )}
        >
          {tool?.toolName === "web" &&
            tool.result?.results?.map((item: any, i: number) => {
              const faviconUrl = item?.url
                ? new URL("/favicon.ico", item.url).href
                : null;
              return (
                <a key={i} className="text-xs mt-3" href={item?.url!}>
                  <span className="flex flex-row gap-1 font-bold mb-1">
                    {faviconUrl && (
                      <Suspense
                        fallback={
                          <div className="w-3 h-3 border-4 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
                        }
                      >
                        <img
                          src={faviconUrl}
                          alt={`${item.title} favicon`}
                          className="w-3 h-3"
                          loading="lazy"
                        />
                      </Suspense>
                    )}
                    {item.title}
                  </span>
                  <span className="text-xs">{item.content}</span>
                </a>
              );
            })}
        </CollapsibleContent>
      </Collapsible>
    </>
  );
};
