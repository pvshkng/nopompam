import { cn } from "@/lib/utils";
import {
  Globe,
  BookOpenText,
  ChartCandlestick,
  Gamepad2,
  Clapperboard,
  Brain,
} from "lucide-react";

// prettier-ignore
const templates = [
  { icon: ChartCandlestick, prompt: "Research NVIDIA stock?", type: "research", },
  { icon: Globe, prompt: "What's happening in Texas?", type: "web" },
  { icon: Gamepad2, prompt: "When will Silksong be released?", type: "web" },
  { icon: Clapperboard, prompt: "Is Pedro Pascal gay?", type: "web" },
  { icon: Brain, prompt: "Is Gemini better than OpenAI?", type: "web" },
];

export function MessageTemplate(props: any) {
  const { setInput } = props;
  // handleSubmit({}, { body: {} });
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
                "flex items-center",
                "gap-2 p-2",
                "rounded-sm  bg-neutral-100 border border-stone-300",
                "cursor-pointer",
                "[&>*]:hover:text-stone-900"
              )}
            >
              <t.icon width={24} height={24} className="text-stone-500" />
              <p className="text-stone-700 text-xs">{t.prompt}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}
