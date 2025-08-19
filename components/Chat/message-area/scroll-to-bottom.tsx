import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "@radix-ui/react-icons";
export function BottomScrollButton(props: any) {
  const { scrollToBottom, isBottom } = props;

  return (
    <div
      className={cn(
        "rounded-full bg-white/2.5 border border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 transition-all ",
        "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
        "after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none transition antialiased",
        "size-6 p-1 cursor-pointer right-1/2 bottom-4 flex items-center justify-center",
        "relative",
        "text-white text-[10px] font-semibold",
        isBottom ? "hidden" : "absolute",
        "animate-bounce",
        "shadow-md"
        //"absolute"
      )}
      onClick={() => {
        scrollToBottom();
      }}
    >
      <ArrowDownIcon className="text-stone-700" height={24} width={24} />
    </div>
  );
}
