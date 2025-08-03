import { cn } from "@/lib/utils";
import { ChartCandlestick, LoaderCircle } from "lucide-react";
import { AreaChartGradient } from "@/components/charts/area-chart";
import { memo, useEffect, useState } from "react";
import { MessageSkeleton } from "@/components/chat/message-area/message-loading-skeleton";
import { ChartAreaGradient } from "@/components/charts/chart-area-gradient";

type Status = "loading" | "ready" | "error";

const PureStock = (props: any) => {
  const { symbol } = props;
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    setTimeout(() => setStatus("ready"), 3000);
  }, []);

  return (
    <>
      <div
        className={cn(
          "flex flex-col w-full h-full px-4 py-3 gap-2 m-2",
          "border border-stone-300 rounded-md bg-neutral-100"
        )}
      >
        <div className="flex flex-row text-stone-500 items-center gap-2">
          {status === "loading" ? (
            <LoaderCircle size={16} className="!animate-spin !opacity-100" />
          ) : (
            <ChartCandlestick size={16} />
          )}
          STOCK
          {symbol && (
            <>
              {" "}
              <hr className="flex h-full w-px border border-stone-400" />
              {symbol!}
            </>
          )}
        </div>
        <div className="flex flex-col h-full">
          {status === "loading" && <MessageSkeleton />}
          {status === "ready" && <ChartAreaGradient />}
          {status === "error" && <MessageSkeleton />}
        </div>
      </div>
    </>
  );
};

export const Stock = memo(PureStock);
