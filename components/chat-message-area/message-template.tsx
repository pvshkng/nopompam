import { cn } from "@/lib/utils";
import {
  Globe,
  ChartCandlestick,
  Gamepad2,
  Clapperboard,
  Brain,
} from "lucide-react";
import { useInputStore } from "@/lib/stores/input-store";

// prettier-ignore
const templates = [
  { icon: ChartCandlestick, prompt: "Research Figma IPO", type: "research", },
  { icon: Globe, prompt: "What's happening in Texas?", type: "web" },
  { icon: Gamepad2, prompt: "When will Silksong be released?", type: "web" },
  { icon: Clapperboard, prompt: "Does the Matrix really exist?", type: "web" },
  { icon: Brain, prompt: "Is Gemini better than OpenAI?", type: "web" },
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
              <t.icon width={24} height={24} className="text-violet-500" />
              <p className="text-violet-700 text-xs max-sm:text-[10px] m-0 p-0">
                {t.prompt}
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}
