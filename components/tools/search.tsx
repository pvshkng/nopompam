"use client";

import { useToolStore, SearchQuery } from "@/lib/stores/tool-store";

import { cn } from "@/lib/utils";
import {
  SearchCode,
  LoaderCircle,
  CircleCheckBig,
  Link,
  Circle,
} from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Tool, ToolHeader, ToolContent } from "@/components/tools/";
import { MessageSkeleton } from "../chat/message-area/message-loading-skeleton";
import { ToolSkeleton } from "@/components/skeleton";
import { UITool } from "ai";
import { useState, useEffect, useMemo } from "react";
import { Suspense } from "react";
import { TavilySearchResponse } from "@tavily/core";

function SearchResult({ results }: { results: TavilySearchResponse[] }) {
  if (!results || results.length === 0) return null;

  return results.map((result: any, i: number) => (
    <a key={i} className="text-xs mt-3 block" href={result?.url!}>
      <span className="flex gap-1 mb-1 font-semibold items-center overflow-hidden underline">
        <Suspense fallback={<Link className="text-stone-500 size-3" />}>
          <img
            src={result.favicon}
            alt={""}
            width={12}
            height={12}
            loading="eager"
            onError={(e) => {
              e.currentTarget.src = "/icon/search.svg";
            }}
          />
        </Suspense>
        <span className="text-[10px] truncate">{result.title}</span>
      </span>
      <span className="text-[10px] line-clamp-2 text-stone-600">
        {result.content}
      </span>
    </a>
  ));
}

function SearchContent({ tool, draftTool }) {
  const queries = useMemo(() => {
    if (tool.state === "output-available" && tool.output) {
      return tool.input.queries.map((query, index) => ({
        index,
        content: query,
        status: "complete" as const,
        results: tool.output[index.toString()] || tool.output[index] || [],
      }));
    }

    if (
      tool.state === "input-available" &&
      draftTool?.isStreaming &&
      draftTool.draftQueries
    ) {
      return Object.entries(draftTool.draftQueries).map(([index, query]) => ({
        index: Number(index),
        content: query.content,
        status: query.status,
        results: query.results || [],
      }));
    }

    if (tool.input?.queries) {
      return tool.input.queries.map((query, index) => ({
        index,
        content: query,
        status: "pending" as const,
        results: [],
      }));
    }

    return [];
  }, [tool, draftTool]);

  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    const indexes = queries.map((q) => q.index.toString());
    setOpenItems((prev) =>
      prev.length === indexes.length && prev.every((v, i) => v === indexes[i])
        ? prev
        : indexes
    );
  }, [queries]);

  return (
    <Accordion
      type="multiple"
      value={openItems}
      onValueChange={setOpenItems}
      className="flex flex-col w-full mx-auto"
    >
      {queries.map((q) => (
        <AccordionItem key={q.index} value={q.index.toString()}>
          <AccordionPrimitive.Header className="!border-none">
            <AccordionPrimitive.Trigger className="w-full">
              <span className="flex flex-row items-center justify-start gap-1 text-[10px] w-full">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full p-1 border border-dashed",
                    q.status === "pending" &&
                      "text-stone-400 border-stone-400 bg-stone-50",
                    q.status === "complete" &&
                      "text-green-600 border-green-600 bg-green-50",
                    q.status === "error" &&
                      "text-red-600 border-red-600 bg-red-50"
                  )}
                >
                  {q.status === "pending" && (
                    <LoaderCircle size={12} className="animate-spin" />
                  )}
                  {q.status === "complete" && <CircleCheckBig size={12} />}
                  {q.status === "error" && <Circle size={12} />}
                </div>
                <span className="underline text-stone-500 truncate">
                  {q.content?.toUpperCase() || `QUERY ${q.index + 1}`}
                </span>
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionContent className="relative !border-none">
            {/* Pseudo dotted line */}
            <div
              className={cn(
                "absolute left-[10px] -top-5 -bottom-0 w-px border-l border-dotted border-stone-500",
                q.index === queries.length - 1 && "hidden"
              )}
            />

            <div className="text-[10px] ml-6 max-w-full text-stone-400 overflow-hidden">
              {q.status === "pending" && <ToolSkeleton />}
              {q.status === "complete" && q.results.length > 0 && (
                <SearchResult results={q.results} />
              )}
              {q.status === "complete" && q.results.length === 0 && (
                <div className="text-stone-500 text-xs">No results found</div>
              )}
              {q.status === "error" && (
                <div className="text-red-500 text-xs">
                  Error searching this query
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function Search({
  tool,
}: {
  tool: UITool & { state: string; type: string };
}) {
  const getDraftTool = useToolStore((state) => state.getDraftTool);

  const draftTool =
    tool.state === "output-available" ? null : getDraftTool(tool.toolCallId);

  const isStreaming =
    tool.state === "input-streaming" ||
    (tool.state === "input-available" && draftTool?.isStreaming);

  return (
    <Tool>
      <ToolHeader>
        <span className="flex text-stone-500 items-center gap-2 overflow-hidden max-w-full">
          {isStreaming ? (
            <LoaderCircle size={16} className="!animate-spin !opacity-100" />
          ) : (
            <SearchCode size={16} className="shrink-0" />
          )}
          <span className="text-xs truncate">SEARCH</span>
        </span>
      </ToolHeader>
      <ToolContent>
        <div className="flex flex-col w-full item-center justify-center mt-2">
          <SearchContent tool={tool} draftTool={draftTool} />
        </div>
      </ToolContent>
    </Tool>
  );
}
