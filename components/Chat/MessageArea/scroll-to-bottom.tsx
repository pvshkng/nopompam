import { cn } from "@/lib/utils";
export function BottomScrollButton(props: any) {
  const { scrollToBottom, isCurrentBottom } = props;
  return (
    <div
      className={cn(
        "p-1 cursor-pointer right-1/2 translate-x-1/2 bottom-0 z-10 rounded-t-md flex items-center justify-center",
        "relative bg-gradient-to-r from-neutral-300 to-stone-300",
        "border-1 border-[#302d2c] text-neutral-400 text-[10px] font-semibold",
        "shadow-[0_0px_20px_rgba(232,78,49,0.1)]",
        isCurrentBottom ? "hidden" : "absolute"
        //"absolute"
      )}
      onClick={() => {
        scrollToBottom();
      }}
    >
      Scroll to bottom
    </div>
  );
}
