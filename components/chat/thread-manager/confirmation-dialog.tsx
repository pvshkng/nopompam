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
import { useState } from "react";

export function DeleteConfirmationDialog(props: any) {
  const { children } = props;

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this thread?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
          <Button>Confirm</Button>
          {/*  <DialogClose>Cancel</DialogClose> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
