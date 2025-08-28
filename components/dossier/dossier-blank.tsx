"use client";
import { memo } from "react";
import { cn } from "@/lib/utils";

const template = [
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
];

const PureBlankDocument = (props: any) => {
  return (
    <div className={cn("flex flex-col size-full items-center justify-center")}>
      <p className={cn("text-xs font-semibold text-stone-400")}>
        There's no documents in the dossier yet
      </p>
      <p className={cn("text-xs font-semibold text-stone-300")}>
        Ask nopompam to create one
      </p>
    </div>
  );
};

export const BlankDocument = memo(PureBlankDocument);
