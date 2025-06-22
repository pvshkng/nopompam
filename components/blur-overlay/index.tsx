import { cn } from "@/lib/utils";
import { memo } from "react";

const PureBlurOverlay = (props: any) => {
  const { sidebarToggled, setSidebarToggled } = props;
  return (
    <div
      onClick={() => {
        sidebarToggled && setSidebarToggled(false);
      }}
      className={cn(
        "pointer-events-none",
        sidebarToggled &&
          "max-sm:backdrop-blur-sm max-sm:bg-white/10 max-sm:!cursor-pointer max-sm:!pointer-events-auto",
        "z-10 transition-all delay-100 absolute flex size-full"
      )}
    />
  );
};

export const BlurOverlay = memo(PureBlurOverlay);
