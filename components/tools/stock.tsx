import { cn } from "@/lib/utils";
import { ChartCandlestick, LoaderCircle } from "lucide-react";
import { AreaChartGradient } from "@/components/charts/area-chart";

export const Stock = (props: any) => {
  const { toolInvocation } = props;
  return (
    <div
      className={cn(
        "flex flex-col max-w-full px-4 py-3 gap-2 m-2",
        "border border-stone-300 rounded-md bg-neutral-100"
      )}
    >
      <div className="flex flex-row text-stone-500 items-center gap-2">
        {toolInvocation?.state !== "result" ? (
          <LoaderCircle size={16} className="!animate-spin !opacity-100" />
        ) : (
          <ChartCandlestick size={16} />
        )}
        STOCK
        {toolInvocation?.args?.symbol && (
          <>
            {" "}
            <hr className="flex h-full w-px border border-stone-400" />
            {toolInvocation?.args?.symbol}
          </>
        )}
      </div>
      {toolInvocation?.state === "result" && toolInvocation?.result ? (
        <AreaChartGradient toolInvocation={toolInvocation} />
      ) : null}
    </div>
  );
};
