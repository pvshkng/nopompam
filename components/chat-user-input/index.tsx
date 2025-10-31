"use client";

import { memo, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import React from "react";
import { useRef } from "react";
import { ArrowUp, CircleStop } from "lucide-react";
import { UserInputOptions } from "./user-input-options";
import { MessageTemplate } from "@/components/chat-message-area/message-template";
import { useAuthDialogStore } from "@/lib/stores/auth-dialog-store";
import { useShallow } from "zustand/react/shallow";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { useInputStore } from "@/lib/stores/input-store";

const PureUserInput = memo(function PureUserInput(props: any) {
  const { stop, session, messages, status, handleSubmit, model, setModel } =
    props;
  const { dossierOpen, setDossierOpen } = useDossierStore();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { input, setInput } = useInputStore();
  const { openAuthDialog } = useAuthDialogStore(
    useShallow((state) => ({
      openAuthDialog: state.open,
    }))
  );

  // Debounced height adjustment
  const adjustHeight = useCallback((element: HTMLTextAreaElement) => {
    requestAnimationFrame(() => {
      element.style.height = "auto";
      element.style.height = `${Math.min(element.scrollHeight, 150)}px`;
    });
  }, []);

  // Memoize handlers
  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      adjustHeight(e.target);
    },
    [setInput, adjustHeight]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (session) {
          handleSubmit(e);
          if (inputRef.current) {
            inputRef.current.style.height = "auto";
          }
        } else {
          openAuthDialog();
        }
      }
    },
    [session, handleSubmit, openAuthDialog]
  );

  const handleButtonClick = useCallback(
    (e: React.MouseEvent) => {
      if (status !== "ready") {
        stop();
      }
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
      if (session) {
        handleSubmit(e);
      } else {
        openAuthDialog();
      }
    },
    [status, stop, session, handleSubmit, openAuthDialog]
  );

  return (
    <div className="w-full flex items-center justify-center my-auto">
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          "w-full px-auto px-3 mb-1 bg-transparent"
        )}
      >
        {messages.length === 0 && status === "ready" && <MessageTemplate />}

        <div
          className={cn(
            "relative",
            "bg-black/20 border border-white/50 backdrop-blur-sm rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)]",
            "placeholder:text-white",
            "focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/30",
            "transition-all duration-300 resize-none relative",
            "before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
            "after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none",
            "flex flex-row mx-auto w-full max-w-[800px]"
          )}
        >
          <div className="flex flex-row w-full">
            <textarea
              ref={inputRef}
              autoFocus
              autoComplete="off"
              rows={1}
              placeholder="Ask me anything..."
              className={cn(
                "text-sm break-all outline-none border-none bg-transparent",
                "mx-4 my-3 w-full h-auto resize-none overflow-auto",
                "placeholder:truncate"
              )}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            onClick={handleButtonClick}
             className={cn(
              "rounded-md bg-black/20 border border-white/50 backdrop-blur-sm shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] hover:bg-white/30",
              "flex items-center justify-center p-1 px-2 m-1"
            )}
          >
            {status === "ready" ? (
              <ArrowUp size={16} color="white" />
            ) : (
              <CircleStop size={16} color="white" />
            )}
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
});

export const UserInput = PureUserInput;
