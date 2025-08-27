"use client";
import { memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";
import { useState, useRef } from "react";
import { ArrowUp, CircleStop, LoaderCircle } from "lucide-react";
import { UserInputOptions } from "./user-input-options";
import { MessageTemplate } from "@/components/chat-message-area/message-template";

import { useAuthDialogStore } from "@/lib/stores/auth-dialog-store";
import { useShallow } from "zustand/react/shallow";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { useInputStore } from "@/lib/stores/input-store";

function PureUserInput(props: any) {
  const { stop, session, messages, status, handleSubmit, model, setModel } =
    props;
  const { dossierOpen, setDossierOpen } = useDossierStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { input, setInput } = useInputStore();
  const { openAuthDialog } = useAuthDialogStore(
    useShallow((state) => ({
      isOpen: state.isOpen,
      setIsOpen: state.setIsOpen,
      openAuthDialog: state.open,
      close: state.close,
    }))
  );

  return (
    <div
      className={
        messages.length === 0
          ? cn(
              "size-full flex items-center justify-center",
              messages.length > 0 ? "" /* fadeOut */ : ""
            )
          : "" //fadeIn
      }
    >
      <div
        id="userInputWrapper"
        className={cn(
          "flex flex-col items-center justify-center",
          "w-full px-auto px-3 mb-1 bg-transparent"
        )}
      >
        {messages.length === 0 && status === "ready" && (
          <MessageTemplate />
        )}
        <div
          className={cn(
            "relative",
            "border border-stone-700 text-black",
            "flex flex-row mx-auto w-full max-w-[800px]"
            //"shadow-lg"
            //"z-[2] flex flex-col pt-1 pb-0 mx-auto rounded-t-2xl border-1 border-[#302d2c] bg-[#0f0909] text-white w-full max-w-[800px]",
          )}
        >
          <div className="flex flex-row w-full bg-stone-50">
            <textarea
              ref={inputRef}
              autoFocus
              autoComplete="off"
              rows={1}
              placeholder="Type / for commands"
              className={cn(
                "text-sm break-all outline-none border-none bg-transparent mx-4 my-3 w-full h-auto resize-none overflow-auto placeholder:truncate"
              )}
              id="userInput"
              value={input}
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  150
                )}px`;
                setInput(e.target.value);
              }}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  if (session) {
                    e.preventDefault();
                    handleSubmit(e);
                    inputRef.current!.style.height = "auto";
                  } else {
                    e.preventDefault();
                    openAuthDialog();
                  }
                }
              }}
            />
            {/* input options */}
          </div>
          <button
            onClick={(e) => {
              if (status !== "ready") {
                stop();
              }
              inputRef.current!.style.height = "auto";
              if (session) {
                handleSubmit(e);
                inputRef.current!.style.height = "auto";
              } else {
                openAuthDialog();
              }
            }}
            //disabled={status !== "ready"}
            className={cn(
              "flex items-center justify-center bg-stone-700 p-1 px-2"
            )}
            //hidden={!isEditorActive}
          >
            {status === "ready" ? (
              <ArrowUp size={24} color="white" />
            ) : (
              <CircleStop size={24} color="white" />
            )}
            {/* <Image src="/icon/enter.svg" width={24} height={24} alt="send" /> */}
          </button>
        </div>
        <UserInputOptions
          dossierOpen={dossierOpen}
          setDossierOpen={setDossierOpen}
          model={model}
          setModel={setModel}
        />
      </div>
    </div>
  );
}

export const UserInput = memo(PureUserInput);
