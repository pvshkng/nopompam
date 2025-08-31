import { cn } from "@/lib/utils";
import { memo } from "react";
import { ThreadManager } from "@/components/chat-thread-manager";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/use-media-query";
import { generateId } from "ai";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Separator } from "@/components/ui/separator";
import { PanelRight, PanelBottom, Plus, MessageSquare } from "lucide-react";
import { useDossierStore } from "@/lib/stores/dossier-store";

export const PureNavigation = (props: any) => {
  const { _id, session, setMessages, threads, setThreads } = props;
  const { setDossierOpen, dossierOpen } = useDossierStore();
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const threadExists = threads.some((t: any) => t._id === _id);
  return (
    <div
      className={cn(
        "z-10 opacity-70",
        "absolute flex flex-col items-start justify-center",
        "p-1.5 gap-2",
        "transition-all duration-300 ease-in-out"
      )}
    >
      {/* New Chat Button */}
      <button
        disabled={!threadExists}
        onClick={(e) => {
          router.push("/chat");
          e.currentTarget.children[0].classList.add("animate-pulse");
        }}
        className={cn(
          "not-italic",
          "flex flex-row items-center font-black text-xs gap-1",
          threadExists ? "text-stone-600" : "cursor-not-allowed !text-stone-400"
        )}
      >
        <Plus width={16} height={16} strokeWidth={3} />
      </button>
      <Separator orientation="horizontal" className="w-full bg-stone-300" />

      {/* Thread Manager */}
      <Drawer direction="left">
        <DrawerTrigger
          className={cn(
            "flex flex-row items-center font-black text-xs gap-1",
            "text-stone-600"
          )}
        >
          <MessageSquare width={16} height={16} strokeWidth={3} />
        </DrawerTrigger>

        <DrawerContent className="p-0">
          <DrawerHeader hidden className="p-0 m-0">
            <DrawerTitle hidden></DrawerTitle>
            <DrawerDescription hidden></DrawerDescription>
          </DrawerHeader>
          <ThreadManager
            _id={_id}
            session={session}
            threads={threads}
            setThreads={setThreads}
            Close={DrawerClose}
          />
        </DrawerContent>
      </Drawer>
      <Separator orientation="horizontal" className="w-full bg-stone-300" />
      <button
        onClick={() => {
          setDossierOpen(!dossierOpen);
        }}
        className={cn(
          "flex flex-row items-center font-black text-xs gap-1",
          "text-stone-600"
        )}
      >
        {isDesktop ? (
          <PanelRight width={16} height={16} strokeWidth={3} />
        ) : (
          <PanelBottom width={16} height={16} strokeWidth={3} />
        )}
      </button>
    </div>
  );
};

export const Navigation = memo(PureNavigation);
