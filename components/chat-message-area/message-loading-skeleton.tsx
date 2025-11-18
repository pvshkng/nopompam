import { cn } from "@/lib/utils";
import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const PureMessageSkeleton = () => {
  return (
    <div className="stream-ignore flex flex-col items-start gap-2 my-2 !animate-in !fade-in !opacity-100 !duration-1000">
      <div className="h-[20px] w-full max-w-[50%] rounded-sm bg-blue-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent animate-wave"></div>
      </div>
      {/* <div className="h-[20px] w-full max-w-[90%] rounded-sm bg-blue-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent animate-wave"></div>
      </div>
      <div className="h-[20px] w-full max-w-[75%] rounded-sm bg-blue-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent animate-wave"></div>
      </div>
      <div className="h-[20px] w-full max-w-[30%] rounded-sm bg-blue-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent animate-wave"></div>
      </div> */}
    </div>
  );
};

export const MessageSkeleton = memo(PureMessageSkeleton);
