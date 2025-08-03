"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginComponent } from "@/components/login/login-component";
import { useAuthDialogStore } from "@/lib/stores/auth-dialog-store";
import { useShallow } from "zustand/react/shallow";
import { memo } from "react";

function PureLoginDialog(props: any) {
  const { children } = props;
  const { isOpen, setIsOpen, open, close } = useAuthDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setIsOpen: state.setIsOpen,
      open: state.open,
      close: state.close,
    }))
  );
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="!rounded-none bg-neutral-100">
        <AlertDialogHeader hidden>
          <AlertDialogTitle hidden />
          <AlertDialogDescription hidden />
        </AlertDialogHeader>
        <div
          className={cn(
            "flex flex-col items-center justify-center h-full ",
            "w-full max-lg:w-full",
            "gap-7"
          )}
        >
          <h1 className="font-bold text-stone-600 text-2xl max-lg:text-xl drop-shadow-xl">
            nopompam
          </h1>
          <div className="z-10">
            <LoginComponent />
          </div>

          {/* Caution */}
          <div className="max-w-[300px]">
            <p className="text-center text-xs text-stone-700 ">
              Nopompam may occasionally provide <u>inaccurate information</u>
              .Use your own judgement and verify the information it provides.
            </p>
          </div>
        </div>
        <AlertDialogFooter className="flex items-center justify-center">
          <AlertDialogCancel className="focus-visible::!outline-none focus-visible:!ring-0 underline items-center mx-auto text-xs border-none bg-transparent shadow-none">
            Continue without login
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const LoginDialog = memo(PureLoginDialog);
