import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { DeleteConfirmationDialog } from "@/components/chat-thread-manager/confirmation-dialog";
import { useState } from "react";
export function EllipsisMenu(props: any) {
  const { children, _id, targetId, setThreads } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn("rounded-none bg-blue-700 text-blue-200 border-none")}
        >
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
          <DropdownMenuItem className={cn("rounded-none hover:bg-blue-900")}>
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn("rounded-none hover:bg-blue-900")}
            onClick={(e) => {
              e.preventDefault();
              
            }}
          >
            <DeleteConfirmationDialog
              _id={_id}
              targetId={targetId}
              setThreads={setThreads}
              setOpen={setOpen}
            >
              Delete
            </DeleteConfirmationDialog>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
