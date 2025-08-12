"use client";

import { GridBackground } from "@/components/background-grid";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Circle,
  CircleDashed,
  LoaderCircle,
  CircleGauge,
  CircleDotDashed,
  CircleCheckBig,
  CircleCheckBigIcon,
} from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { Tool, ToolHeader, ToolContent } from "@/components/tools/";

const plan = [
  { id: "1", status: "complete", content: "Search for news about PPT stock" },
  {
    id: "2",
    status: "pending",
    content: "Look up PTT holdings management direction",
  },
  { id: "3", status: "incomplete", content: "OR IPO Launch" },
  { id: "4", status: "incomplete", content: "Summary of gathered resources" },
];

const mockTool = { state: "output-available", type: "tool-research" };

export default function Research({ tool = mockTool }: { tool: any }) {
  return (
    <Tool tool={tool}>
      <ToolHeader
        tool={tool}
      ></ToolHeader>
      <ToolContent tool={tool}>
        <div className="flex flex-col w-full item-center justify-center mx-auto my-2">
          <Accordion type="multiple" className="flex flex-col w-full mx-auto">
            {plan.map((p, i) => (
              <AccordionItem key={i} value={p.id}>
                <AccordionPrimitive.Header className="!border-none">
                  <AccordionPrimitive.Trigger
                    disabled={p.status === "incomplete"}
                  >
                    <span className="flex flex-row items-center justify-center gap-1 text-[10px]">
                      <div className={cn("flex items-center justify-center rounded-full p-1 text-stone-500 border border-dashed border-stone-500", p.status === "incomplete" ? "bg-stone-100" : "bg-stone-100")}>
                        {p.status === "incomplete" && <Circle size={12} className="text-neutral-100" />}
                        {p.status === "pending" && (
                          <LoaderCircle size={12} className="animate-spin" />
                        )}
                        {p.status === "complete" && (
                          <CircleCheckBig size={12} />
                        )}
                      </div>
                      <span className="underline text-stone-500">{p.content}</span>
                    </span>
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionContent className="relative !border-none">
                  <div
                    className={cn(
                      "absolute left-[10px] top-0 -bottom-0 w-px border-l border-dotted border-stone-500",
                      i == plan.length - 1 && "hidden"
                    )}
                  />

                  <span className="text-[10px] ml-7 text-stone-400">Content Here</span>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ToolContent>
    </Tool>
  );
}
