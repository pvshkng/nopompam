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
import "./raycast.scss";
import { DialogTitle } from "@radix-ui/react-dialog";

export const ModelSelector = (props: any) => {
  const { model, setModel } = props;

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        className={cn(
          "px-2 py-1 !m-0",
          "bg-stone-700 text-stone-200 text-[10px]", //placeholder:text-muted-foreground/70
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
          <span className="text-stone-200 font-normal truncate">{model}</span>
        </span>
        {/*         <kbd className="bg-background text-muted-foreground/70 ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded-none border px-1 font-[inherit] text-[0.625rem] font-medium">
          ⌘K
        </kbd> */}
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} className="raycast">
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
