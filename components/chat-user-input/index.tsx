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
        {messages.length === 0 && status === "ready" && <MessageTemplate />}
        <div
          className={cn(
            /* 
          <div class="flex items-center justify-center w-screen min-h-[400px] bg-cover bg-center bg-no-repeat rounded-md" style="background-image: url('https://images.unsplash.com/photo-1543587858-749d3aedd90e?w=800&auto=format&fit=crop&q=90');">
            <div class="relative w-80">
              <textarea placeholder="Ask anything..." rows="4" class="px-4 py-3 pb-12 w-full text-white text-sm bg-black/20 border border-white/50 backdrop-blur-sm rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] placeholder:text-white/70 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 resize-none relative before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none"></textarea>
              <div class="absolute bottom-3 left-3 flex gap-2">
                <button class="inline-flex items-center justify-center px-2 py-2 text-white text-xs font-medium rounded-md bg-white/20 border border-white/30 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 transition-all duration-300">
                 
                </button>
                <button class="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-white text-xs font-medium rounded-md bg-black/20 border border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-3">
                    <path fill-rule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clip-rule="evenodd" />
                    <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                  </svg>
                  Deep Research
                </button>
              </div>
            </div>
          </div>
         */

            "relative",
            "bg-black/20 border border-white/50 backdrop-blur-sm rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)]",
            "placeholder:text-white",
            "focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30",
            "transition-all duration-300 resize-none relative",
            "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
            "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none",
            "flex flex-row mx-auto w-full max-w-[800px]"
            //"shadow-lg"
            //"z-[2] flex flex-col pt-1 pb-0 mx-auto rounded-t-2xl border-1 border-[#302d2c] bg-[#0f0909] text-white w-full max-w-[800px]",
          )}
        >
          <div className="flex flex-row w-full ">
            <textarea
              ref={inputRef}
              autoFocus
              autoComplete="off"
              rows={1}
              placeholder="Ask me anything..."
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
              "rounded-md bg-black/20 border border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30",
              "flex items-center justify-center p-1 px-2 m-1"
            )}
            //hidden={!isEditorActive}
          >
            {status === "ready" ? (
              <ArrowUp size={16} color="white" />
            ) : (
              <CircleStop size={16} color="white" />
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
