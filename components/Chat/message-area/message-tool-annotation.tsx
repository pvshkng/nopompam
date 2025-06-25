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

import type { JSX } from "react";
import type { BundledLanguage } from "shiki/bundle/web";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { codeToHast } from "shiki/bundle/web";

export async function highlight(code: string, lang: BundledLanguage) {
  const out = await codeToHast(code, {
    lang,
    theme: "github-dark",
  });

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
  }) as JSX.Element;
}

// TODO: map tool name with user friendly name

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
              "mt-2",
              "relative border-0 text-center h-6 opacity-50",
              "before:content-[''] before:absolute before:left-0 before:top-1/2",
              "before:w-full before:h-px",
              "before:bg-gradient-to-r before:from-transparent before:via-neutral-300 before:to-transparent",
              "after:content-[attr(data-content)] after:relative after:inline-block",
              "after:px-2 after:leading-6 after:text-neutral-300 after:bg-neutral-100 after:rounded-xl",
              "text-[10px]"
            )}
            data-content={tool && tool.toolName}
          />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tool && tool.toolName}</DialogTitle>
            <DialogDescription className="">
              {tool && (
                <div className="prose prose-sm prose-invert max-h-[700px] max-w-[500px] overflow-auto">
                  {highlight(JSON.stringify(tool, null, 2), "json")}
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};
