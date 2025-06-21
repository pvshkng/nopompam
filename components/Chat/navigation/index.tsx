import { cn } from "@/lib/utils";
import { LeftSidebar } from "@/components/left-sidebar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = (props: any) => {
  const { sidebarToggled, setSidebarToggled, threads, setThreads } = props;

  return (
    <div
      className={cn(
        "flex flex-row sticky h-12 w-full",
        "border-b border-stone-700 dark:border-stone-700",
        "transition-all duration-300 ease-in-out",
      )}
    >
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent side={"left"}>
          {/* <SheetHeader>
            <SheetTitle>Are you absolutely sure?</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader> */}
          <LeftSidebar
            sidebarToggled={sidebarToggled}
            setSidebarToggled={setSidebarToggled}
            threads={threads}
            setThreads={setThreads}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
};
