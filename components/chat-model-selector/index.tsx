import { cn } from "@/lib/utils";

import * as React from "react";
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

import { OpenAIIcon } from "@/components/icons/openai";

const models = {
  google: ["gemini-2.5-flash", "gemini-2.5-pro"],
  mistral: [
    "mistral-small-latest",
    "mistral-medium-latest",
    "mistral-large-latest",
    "pixtral-large-latest",
  ],
  //openai: ["openai/gpt-oss-120b", "openai/gpt-oss-20b"],
  deepseek: ["deepseek-r1-distill-llama-70b"],
  qwen: ["qwen/qwen3-32b"],
  moonshot: ["moonshotai/kimi-k2-instruct"],
  meta: [
    "meta-llama/llama-4-maverick-17b-128e-instruct",
    "meta-llama/llama-4-scout-17b-16e-instruct",
  ],
  typhoon: ["typhoon-v2.5-30b-a3b-instruct", "typhoon-v2.1-12b-instruct"]
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
};

export const ModelSelector = (props: any) => {
  const { model, setModel } = props;

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        className={cn(
          "px-2 py-1 !m-0",
          "rounded-md",
          "bg-gradient-to-br from-violet-50 to-violet-300 text-violet-700 text-[10px]", //placeholder:text-muted-foreground/70
          "overflow-hidden w-28 h-full", //w-fit
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 inline-flex shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center w-full">
          {/* <SearchIcon
            className="text-muted-foreground/80 -ms-1 me-3"
            size={16}
            aria-hidden="true"
          /> */}
          <span className="text-violet-700 font-normal truncate">{model}</span>
        </span>
        {/*         <kbd className="bg-background text-muted-foreground/70 ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded-none border px-1 font-[inherit] text-[0.625rem] font-medium">
          ⌘K
        </kbd> */}
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search model..." />
        <CommandList className="bg-neutral-50">
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(models).map(([group, items]) => (
            <>
              <CommandGroup
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:text-violet-400"
              >
                {items.map((item) => (
                  <CommandItem
                    className="text-[10px]"
                    key={item}
                    onSelect={() => {
                      setModel(item);
                      setOpen(false);
                    }}
                  >
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
