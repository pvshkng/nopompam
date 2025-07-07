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
  const { children } = props;
  //const [clicked, setClicked] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {children}
        </DropdownMenuTrigger>
        <DropdownMenuContent
        /* className={cn(
            "w-14",
            "rounded-none bg-stone-700 text-stone-200 border-none"
          )} */
        >
          {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator /> */}
          {/* <DropdownMenuItem className={cn("rounded-none hover:bg-stone-900")}>
          Rename
        </DropdownMenuItem> */}

          <DropdownMenuItem
          //className={cn("rounded-none w-full cursor-pointer text-xs")}
          /* onClick={(e) => {
              setClicked(true);
            }}
            onMouseLeave={() => setClicked(false)} */
          >
            Delete
            {/* {!clicked ? (
              "Delete"
            ) : (
              <>
                <div
                  className={cn(
                    "flex flex-row w-full items-center justify-between text-xs",
                    "[&>button]:!px-2",
                    "[&>button]:!m-0",
                    "[&>button]:!text-stone-200",
                    "[&>button]:hover:bg-stone-900"
                  )}
                >
                  <button className="hover:bg-stone-900">
                    <Check strokeWidth={2} />
                  </button>
                  <button className="hover:bg-stone-900">
                    <X strokeWidth={2} />
                  </button>
                </div>
              </>
            )} */}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
