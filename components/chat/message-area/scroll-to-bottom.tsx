import { cn } from "@/lib/utils";
import { ArrowDownIcon } from "@radix-ui/react-icons";
export function BottomScrollButton(props: any) {
  const { scrollToBottom, isCurrentBottom } = props;
  return (
    <div
      className={cn(
        "size-6 p-1 cursor-pointer right-1/2 bottom-4 flex items-center justify-center",
        "relative bg-stone-700",
        "text-white text-[10px] font-semibold",
        "shadow-[0_0px_20px_rgba(232,78,49,0.1)]",
        isCurrentBottom ? "hidden" : "absolute",
        "animate-bounce",
        "shadow-md"
        //"absolute"
      )}
      onClick={() => {
        scrollToBottom();
      }}
    >
      <ArrowDownIcon height={24} width={24} />
    </div>
  );
}
