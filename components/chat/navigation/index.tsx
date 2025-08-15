import { cn } from "@/lib/utils";
import { memo, use } from "react";
import { ThreadManager } from "@/components/chat/thread-manager";
import Link from "next/link";

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
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useDossierStore } from "@/lib/stores/dossier-store";

export const PureNavigation = (props: any) => {
  const { _id, session, threads, setThreads } = props;
  const { setDossierOpen, dossierOpen } = useDossierStore();

  return (
    <div
      className={cn(
        "z-10 opacity-70",
        "absolute flex flex-col items-start justify-center",
        "p-1.5 gap-2",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <Link
        href={{ pathname: "/chat" }}
        prefetch={false}
        className={cn(
          "[writing-mode:sideways-lr]",
          "not-italic",
          "flex flex-row items-center font-black text-xs gap-1",
          "text-stone-500"
        )}
      >
        <Plus
          width={16}
          height={16}
          strokeWidth={3}
          stroke={"#44403c"}
          //className="text-stone-200"
        />
      </Link>
      <Separator orientation="horizontal" className="w-full bg-stone-300" />
      <Drawer direction="left">
        <DrawerTrigger
          className={cn(
            "[writing-mode:sideways-lr]",
            "flex flex-row items-center font-black text-xs gap-1",
            "text-stone-700"
            //"border border-stone-200",
            //"shadow-md"
          )}
        >
          Chat
          <ChevronRight
            width={16}
            height={16}
            strokeWidth={3}
            stroke={"#44403c"}
            //className="text-stone-200"
          />
        </DrawerTrigger>

        <DrawerContent /* side={"left"} */ className="p-0">
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
          "[writing-mode:sideways-lr]",
          "flex flex-row items-center font-black text-xs gap-1",
          "text-stone-700"
          //"border border-stone-200",
          //"shadow-md"
        )}
      >
        Dossier
        <ChevronRight
          width={16}
          height={16}
          strokeWidth={3}
          stroke={"#44403c"}
        />
      </button>
      {/* <Separator orientation="vertical" className="h-5" /> */}
      {/* <ModelSelector /> */}
    </div>
  );
};

export const Navigation = memo(PureNavigation);
