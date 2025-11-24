import { cn } from "@/lib/utils";
import { MODELS } from "@/lib/constants/models";
import * as React from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

export const ModelSelector = (props: any) => {
  const { model, setModel } = props;

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        className={cn(
          "px-2 py-1 !m-0",
          "bg-stone-700 text-stone-200 text-[10px]", 
          "overflow-hidden w-28 h-full",
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 inline-flex shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        )}
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center w-full">
 
          <span className="text-stone-200 font-normal truncate">{model}</span>
        </span>

      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search model..." />
        <CommandList className={cn("bg-white")}>
          <CommandEmpty>No results found.</CommandEmpty>
          {Object.entries(MODELS).map(([group, items]) => (
            <React.Fragment key={group}>
              <CommandGroup
                key={group}
                heading={group}
                className="[&_[cmdk-group-heading]]:text-stone-400"
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
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
};
