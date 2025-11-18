"use client";
import { cn } from "@/lib/utils";
import { DragHandleDots2Icon, SwitchIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function HandleButton(props: any) {
  return (

        <div className="z-10 flex flex-col h-9 w-7 gap-1 items-center justify-center rounded-sm border bg-border">
          <TooltipTrigger>
            <button
              className={cn(
                "flex z-40 size-4 pointer-events-auto cursor-pointer hover:bg-blue-700"
              )}
            >
              <DragHandleDots2Icon className="size-4" />
            </button>
          </TooltipTrigger>
        </div>

  );
}
