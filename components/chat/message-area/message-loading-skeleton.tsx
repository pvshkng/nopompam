import { cn } from "@/lib/utils";
import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const PureMessageSkeleton = () => {
  return (
    <div className="flex flex-col items-start gap-2 my-3 !animate-in !fade-in !duration-500">
      <div className="h-[20px] w-full max-w-[50%] rounded-sm bg-stone-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50 to-transparent animate-wave"></div>
      </div>
      <div className="h-[20px] w-full max-w-[90%] rounded-sm bg-stone-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50 to-transparent animate-wave delay-500"></div>
      </div>
      <div className="h-[20px] w-full max-w-[75%] rounded-sm bg-stone-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50 to-transparent animate-wave delay-700"></div>
      </div>
      <div className="h-[20px] w-full max-w-[30%] rounded-sm bg-stone-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-50 to-transparent animate-wave delay-600"></div>
      </div>
    </div>
  );
};

export const MessageSkeleton = memo(PureMessageSkeleton);
