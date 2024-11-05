"use client";

import * as ui from "@/components/ui/_index";

type CitationBoxProps = {
  citation: string[];
};

export default function CitationBox({
  citation,
  children,
}: {
  citation: string[];
  children: React.ReactNode;
}) {
  return (
    <>
    <ui.TooltipProvider>
        <ui.Tooltip>
          <ui.TooltipTrigger>{children}</ui.TooltipTrigger>
          <ui.TooltipContent className="transition-none">
            <div className="font-bold pb-2">References</div>
            <div>
              {citation?.map((doc: string, i: number) => {
                return <li key={i}>{doc}</li>;
              })}
            </div>
          </ui.TooltipContent>
        </ui.Tooltip>
      </ui.TooltipProvider>
    </>
  );
}
