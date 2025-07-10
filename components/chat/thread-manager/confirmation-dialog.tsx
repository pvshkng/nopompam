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

export function DeleteConfirmationDialog(props: any) {
  const { children } = props;

  return (
    <Dialog>
      <DialogTrigger className="flex w-full">{children}</DialogTrigger>
      <DialogContent
        className={cn(
          "!animate-none rounded-none",
          "border-none",
          "bg-stone-300 text-stone-900"
        )}
      >
        <DialogHeader>
          <DialogTitle>Delete this thread?</DialogTitle>
          <DialogDescription>This action cannot be undone.</DialogDescription>
          <Button className="rounded-none bg-stone-700 hover:bg-stone-800">
            Confirm
          </Button>
          {/*  <DialogClose>Cancel</DialogClose> */}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
