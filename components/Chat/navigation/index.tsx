import { cn } from "@/lib/utils";
import { memo } from "react";
import { ThreadManager } from "@/components/Chat/thread-manager";
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
export const PureNavigation = (props: any) => {
  const { sidebarToggled, setSidebarToggled, threads, setThreads } = props;

  return (
    <div
      className={cn(
        "flex flex-row sticky h-10 w-full items-center gap-2",
        "px-2",
        "border-b border-stone-700 dark:border-stone-700",
        "transition-all duration-300 ease-in-out",
        "shadow-md"
      )}
    >
      <p className={cn("font-semibold text-xs text-stone-700")}>Nopompam</p>

      <Separator orientation="vertical" className="h-5" />
      <Sheet>
        <SheetTrigger
          className={cn(
            "flex flex-row items-center font-semibold text-xs gap-1 text-stone-700"
          )}
        >
          Chat
          <ArrowDownWideNarrow
            width={16}
            height={16}
            stroke={"black"}
            className="text-stone-700"
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
      <Separator orientation="vertical" className="h-5" />
    </div>
  );
};

export const Navigation = memo(PureNavigation);
