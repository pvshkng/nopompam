import Loader from "@/components/Loader/Loader";
import { cn } from "@/lib/utils";
export default function Loading() {
  return (
    <>
      <div
        className={cn(
          "relative flex-1 flex-col overflow-hidden",
          "flex items-center justify-center h-full w-full bg-gradient-to-br from-[#70e4a6] to-[#007c3a]"
        )}
      >
        <Loader />
      </div>
    </>
  );
}