import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const ToolAnnotation = ({ tool }) => {
  return (
    <React.Fragment>
      <Dialog>
        <DialogTrigger>
          {/* <span className="text-[10px] font-semibold !text-stone-200 bg-stone-50 rounded-2xl py-1">
            {tool && tool.toolName}
          </span> */}
          <hr
            className={cn(
              "relative border-0 text-center h-6 opacity-50",
              "before:content-[''] before:absolute before:left-0 before:top-1/2",
              "before:w-full before:h-px",
              "before:bg-gradient-to-r before:from-transparent before:via-neutral-300 before:to-transparent",
              "after:content-[attr(data-content)] after:relative after:inline-block",
              "after:px-2 after:leading-6 after:text-neutral-300 after:bg-[#fcfcfa]",
              "text-[10px]"
            )}
            data-content={tool && tool.toolName}
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tool && tool.toolName}</DialogTitle>
            <DialogDescription>
              {JSON.stringify(tool, null, 2)}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
