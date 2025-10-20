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
import { cn } from "@/lib/utils";
import { deleteThread } from "@/lib/mongo/chat-store";
import { useState, useRef } from "react";

export function DeleteConfirmationDialog(props: any) {
  const { children, _id, targetId, setThreads, /* setOpen */ } = props;
  const [loading, setLoading] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = async () => {
    setLoading(true);
    const res = await deleteThread(targetId);
    if (res.success) {
      setThreads((prev: any) => prev.filter((h: any) => h._id !== targetId));
      closeRef.current?.click();
      setLoading(false);
      //setOpen(false);

      if (_id === targetId) {
        window.location.href = "/chat";
      }
    } else {
      console.error("Failed to delete thread:", res.error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex w-full">{children}</DialogTrigger>
      <DialogContent
        className={cn(
          "!animate-none rounded-none",
          "border-none",
          "bg-violet-300 text-violet-900"
        )}
      >
        <DialogHeader>
          <DialogTitle>Delete this thread?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
          <Button
            className="rounded-none bg-violet-700 hover:bg-violet-800"
            onClick={handleConfirm}
          >
            {loading ? (
              <div className="w-[30px] h-[30px] border-4 border-violet-300 border-t-violet-800 rounded-full animate-spin" />
            ) : (
              "Delete"
            )}
          </Button>
          <DialogClose hidden ref={closeRef} />
          {/*  <DialogClose>Cancel</DialogClose> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
