"use client";
import { memo, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { getArtifacts } from "@/lib/mongo/artifact-store";
import { DossierBrowser } from "@/components/dossier/dossier-browser";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { X, House, NotebookPen, Save, Loader2 } from "lucide-react";
import { EmblaCarousel } from "@/components/embla-carousel";
import { EmblaOptionsType } from "embla-carousel";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";

import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

const template = [
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
];

const iconMapping: Record<string, any> = {
  text: NotebookPen,
  sheet: NotebookPen,
  //image: House,
};

const OPTIONS: EmblaOptionsType = { slidesToScroll: "auto" };
const SLIDE_COUNT = 10;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const PureBlankDocument = (props: any) => {
  const { messages = [] } = props;
  const syncChatDocuments = useDossierStore((state) => state.syncChatDocuments);
  const chatDocuments = useDossierStore((state) => state.chatDocuments);
  const { getDocument, addDocument, switchTab } = useDossierStore.getState();

  useEffect(() => {
    syncChatDocuments(messages);
  }, [messages, syncChatDocuments]);

  const handleDocumentSelect = useCallback(
    (doc: any) => {
      const existingDoc = getDocument(doc.id);
      if (existingDoc) {
        switchTab(doc.id);
      } else {
        addDocument(doc);
      }
    },
    [addDocument]
  );

  return (
    <div className={cn("flex flex-col size-full items-center justify-center")}>
      {chatDocuments.length > 0 ? (
        <>
          <Command className="">
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="In this chat">
                {chatDocuments.map((doc, i) => {
                  return (
                    <CommandItem
                      className="gap-1"
                      key={i}
                      onSelect={() => handleDocumentSelect(doc)}
                    >
                      <iconMapping.text className="size-4 min-w-4 min-h-4 text-stone-500" />
                      <span className="text-xs text-stone-500 truncate">
                        {doc.title || "Untitled"}
                      </span>
                    </CommandItem>
                  );
                })}
                {/* <CommandItem disabled>
              <Calculator />
              <span>Calculator</span>
            </CommandItem> */}
              </CommandGroup>
              {/* <CommandSeparator />
              <CommandGroup heading="Others">
                <CommandItem className="gap-1">
                  <User />
                  <span>Profile</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem className="gap-1">
                  <CreditCard />
                  <span>Billing</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem className="gap-1">
                  <Settings />
                  <span>Settings</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup> */}
            </CommandList>
          </Command>
        </>
      ) : (
        <>
          <p className={cn("text-xs font-semibold text-stone-400")}>
            There's no documents in the dossier yet
          </p>
          <p className={cn("text-xs font-semibold text-stone-300")}>
            Ask nopompam to create one
          </p>
        </>
      )}

      {/* <p>{chatDocuments.map((d) => <p>{d.title} {d.id}</p>)}</p> */}
    </div>
  );
};

export const BlankDocument = memo(PureBlankDocument);
