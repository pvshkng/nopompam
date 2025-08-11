import { memo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { GridBackground } from "../background-grid";

const PureBlankDocument = (props: any) => {
  return (
    <div className={cn("flex flex-col size-full items-center justify-center")}>
      ayo
    </div>
  );
};

export const BlankDocument = memo(PureBlankDocument);
