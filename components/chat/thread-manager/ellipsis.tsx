import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/chat/thread-manager/confirmation-dialog";
import { useState } from "react";
export function EllipsisMenu(props: any) {
  const { children, _id, targetId, setThreads } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false} open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn("rounded-none bg-stone-700 text-stone-200 border-none")}
        >
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
          <DropdownMenuItem className={cn("rounded-none hover:bg-stone-900")}>
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn("rounded-none hover:bg-stone-900")}
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
