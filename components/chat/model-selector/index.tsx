import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const models = {
  google: [
    "ministral-3b-latest",
    "ministral-8b-latest",
    "mistral-large-latest",
    "mistral-small-latest",
    "pixtral-large-latest",
    "pixtral-12b-2409",
    "open-mistral-7b",
    "open-mixtral-8x7b",
    "open-mixtral-8x22b",
    "typhoon-v2.1-12b-instruct",
    "gemini-2.5-pro",
    "gemini-2.5-pro-preview-05-06",
    "gemini-2.5-flash",
    "gemini-2.5-flash-preview-04-17",
    "gemini-2.5-flash-lite-preview-06-17",
  ],
};

export const ModelSelector = (props: any) => {
  const { model, setModel } = props;
  return (
    <div
      className={cn(
        "px-2 p-1 m-0 flex bg-stone-700 text-stone-200 overflow-hidden w-24 h-full"
        //"border border-dashed border-sky-300/60 bg-sky-400/10 group-hover:bg-sky-400/15 dark:border-sky-300/30"
      )}
    >
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger className="flex !min-w-0 !p-0 !m-0 rounded-none border-none text-[10px] overflow-hidden">
          <SelectValue placeholder="Select model" className="" />
        </SelectTrigger>

        {Object.keys(models).map((provider) => (
          <SelectContent
            key={provider}
            className={cn(
              "!max-h-[200px] overflow-auto rounded-none",
              "border-stone-700 shadow-none",
              "m-0 p-0"
            )}
          >
            {
              // @ts-ignore
              models[provider].map((model) => (
                <SelectItem
                  className="text-[10px] !truncate"
                  key={model}
                  value={model}
                >
                  {model}
                </SelectItem>
              ))
            }
          </SelectContent>
        ))}

        {/*  <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent> */}
      </Select>
    </div>
  );
};
