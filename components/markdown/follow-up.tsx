import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInputStore } from "@/lib/stores/input-store";
export const FollowUp = ({ children }: { children: React.ReactNode }) => {
  const { setInput } = useInputStore();

  return (
    <span
      onClick={() => {
        if (children) {
          setInput(children.toString());
        }
      }}
      className={cn(
        "bg-black/5 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)]",
        "hover:bg-white/30 !transition-all !duration-300",
        //"before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
        //"after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none",
        
        "flex flex-row w-full justify-between items-center",
        "rounded-lg p-1 px-2 my-1",
        "cursor-pointer",
      )}
    >
      <span className={cn("font-medium text-blue-700 text-[10px] truncate")}>
        {children}
      </span>
      <ArrowRight className="min-w-4 min-h-4 size-4 text-blue-700" />
    </span>
  );
};
