import { cn } from "@/lib/utils";
import { memo } from "react";
import { ThreadManager } from "@/components/chat/thread-manager";
import { ModelSelector } from "@/components/chat/model-selector";
import Link from "next/link";

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
  const { sidebarToggled, setSidebarToggled, threads, setThreads } = props;

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
      <Sheet>
        <SheetTrigger
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
        </SheetTrigger>

        <SheetContent side={"left"} className="p-0">
          <SheetHeader>
            <SheetTitle hidden>Are you absolutely sure?</SheetTitle>
            <SheetDescription hidden>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          <ThreadManager
            sidebarToggled={sidebarToggled}
            setSidebarToggled={setSidebarToggled}
            threads={threads}
            setThreads={setThreads}
            Close={SheetClose}
          />
        </SheetContent>
      </Sheet>
      {/* <Separator orientation="vertical" className="h-5" /> */}
      {/* <ModelSelector /> */}
    </div>
  );
};

export const Navigation = memo(PureNavigation);
