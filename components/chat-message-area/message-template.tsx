import { cn } from "@/lib/utils";
import {
  Globe,
  ChartCandlestick,
  Gamepad2,
  Clapperboard,
  Bot,
  Brain,
  CodeXml,
  HandHelping,
} from "lucide-react";
import { useInputStore } from "@/lib/stores/input-store";

// prettier-ignore
const templates = [
  { icon: ChartCandlestick, prompt: "What is the current price of BKNG", type: "research", },
  { icon: Globe, prompt: "Find me best deals on Agoda?", type: "web" },
  { icon: Bot, prompt: "Does Agoda use AI in hiring?", type: "web" },
  { icon: CodeXml, prompt: "What's the most popular FE framework?", type: "web" },
  { icon: HandHelping, prompt: "Agoda CSR Activity", type: "web" },
];

const colorMap = [
  "text-red-500",
  "text-yellow-500",
  "text-green-500",
  "text-purple-600",
  "text-blue-700",
];

export function MessageTemplate(props: any) {
  const { setInput } = useInputStore();
  return (
    <>
      <div
        className={cn(
          "max-w-[800px]",
          "flex flex-wrap items-center justify-center gap-2 my-5"
        )}
      >
        {templates.map((t, i) => {
          return (
            <div
              key={i}
              onClick={() => setInput(t.prompt)}
              className={cn(
                "rounded-lg",
                "border border-white/50 backdrop-blur-sm hover:bg-white/30",
                "transition-all",
                "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
                "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none antialiased",
                "shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)]",
                "flex flex-row items-center justify-center",
                "gap-2 p-2",
                "cursor-pointer"
              )}
            >
              <t.icon width={24} height={24} className={cn(colorMap[i])} />
              <p
                className={cn(
                  "text-xs max-sm:text-[10px] m-0 p-0",
                  colorMap[i]
                )}
              >
                {t.prompt}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
