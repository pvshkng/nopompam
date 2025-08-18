import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInputStore } from "@/lib/stores/input-store";
export const FollowUp = ({ children }: { children: React.ReactNode }) => {
  const { setInput } = useInputStore();

  return (
    <div
      onClick={() => {
        if (children) {
          setInput(children.toString());
        }
      }}
      className={cn(
        "flex flex-row w-full justify-between items-center",
        "rounded-lg p-1 px-2 my-1",
        "border border-stone-200 bg-neutral-100",
        "cursor-pointer",
        "transition-all hover:-translate-y-1 hover:shadow-md"
      )}
    >
      <span className={cn("font-medium text-stone-400 text-[10px] truncate")}>
        {children}
      </span>
      <ArrowRight className="min-w-4 min-h-4 size-4 text-stone-400" />
    </div>
  );
};
