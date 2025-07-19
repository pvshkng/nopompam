import { cn } from "@/lib/utils";
import { memo } from "react";
import { ThreadManager } from "@/components/chat/thread-manager";
import { ModelSelector } from "@/components/chat/model-selector";
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

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/_index";
import { ArrowDownWideNarrow } from "lucide-react";
import { ChevronLeft, Plus } from "lucide-react";
export const PureNavigation = (props: any) => {
  const {
    _id,
    session,
    sidebarToggled,
    setSidebarToggled,
    threads,
    setThreads,
  } = props;

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
        replace
        href={{ pathname: "/chat" }}
        prefetch={false}
        className={cn("flex items-center")}
      >
        <Plus
          width={16}
          height={16}
          strokeWidth={3}
          stroke={"#44403c"}
          //className="text-stone-200"
        />
      </Link>
      <Separator orientation="horizontal" className="w-full" />
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
          History
          <ChevronLeft
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
            sidebarToggled={sidebarToggled}
            setSidebarToggled={setSidebarToggled}
            threads={threads}
            setThreads={setThreads}
            Close={SheetClose}
          />
        </DrawerContent>
      </Drawer>
      {/* <Separator orientation="vertical" className="h-5" /> */}
      {/* <ModelSelector /> */}
    </div>
  );
};

export const Navigation = memo(PureNavigation);
