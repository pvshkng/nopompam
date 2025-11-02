import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "@radix-ui/react-icons";

export function BottomScrollButton(props: any) {
  const { scrollToBottom, isBottom } = props;

  return (
    <div
      className={cn(
        "size-6 p-1 cursor-pointer right-1/2 bottom-4 flex items-center justify-center",
        "relative bg-white border border-stone-700",
        "text-white text-[10px] font-semibold",
        "shadow-[0_0px_20px_rgba(232,78,49,0.1)]",
        isBottom ? "hidden" : "absolute",
        "animate-bounce",
        "shadow-md",
        "opacity-70"
      )}
      onClick={() => {
        scrollToBottom();
      }}
    >
      <ArrowDownIcon className="text-stone-700" height={24} width={24} />
    </div>
  );
}
