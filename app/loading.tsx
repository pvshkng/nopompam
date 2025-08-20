import { GridBackground } from "@/components/background";
import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="size-full flex flex-col items-end justify-end">
      <GridBackground />
      <div className="flex flex-row items-center m-4 gap-2 text-stone-500">
        <div className="z-10 font-medium">Loading</div>
        <LoaderCircle width={24} height={24} className="animate-spin" />
      </div>
    </div>
  );
}
