import { cn } from "@/lib/utils";
import { memo } from "react";

const PureDossierFloating = (props: any) => {
  return (
    <div
      className={cn(
        "z-50 flex size-5 border border-blue-700 bg-neutral-50 absolute right-5 bottom-5"
      )}
    >
      H
    </div>
  );
};

export const DossierFloating = memo(PureDossierFloating);