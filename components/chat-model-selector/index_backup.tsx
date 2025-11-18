import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import * as React from "react";
import {
  ArrowUpRightIcon,
  CircleFadingPlusIcon,
  FileInputIcon,
  FolderPlusIcon,
  SearchIcon,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

const models = {
  google: [
    "gemini-2.5-flash",
    "gemini-2.5-pro",
    "mistral-small-latest",
    "mistral-medium-latest",
    "mistral-large-latest",
    "pixtral-large-latest",

    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "moonshotai/kimi-k2-instruct",
    "qwen/qwen3-32b",
    "deepseek-r1-distill-llama-70b",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
    "meta-llama/llama-4-scout-17b-16e-instruct",

    //"pixtral-12b-2409",

    // "deepseek/deepseek-chat-v3-0324:free", // good
    // "moonshotai/kimi-k2:free",
    // "qwen/qwen3-coder:free",
    // "qwen/qwen3-235b-a22b:free",
    // "qwen/qwen3-30b-a3b:free",
    // "gemini-2.5-pro-preview-05-06",
    // "gemini-2.5-flash-preview-04-17",
    // "gemini-2.5-flash-lite-preview-06-17",
    // "ministral-3b-latest",
    // "ministral-8b-latest",

    // "open-mistral-7b",
    // "open-mixtral-8x7b",
    // "open-mixtral-8x22b",
    // "typhoon-v2.1-12b-instruct",
  ],
};

export const ModelSelector = (props: any) => {
  const { model, setModel } = props;

  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  

  return (
    <div
      className={cn(
        "px-2 p-1 m-0 flex bg-blue-700 text-blue-200 overflow-hidden w-24 h-full"
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
              "border-blue-700 shadow-none",
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
