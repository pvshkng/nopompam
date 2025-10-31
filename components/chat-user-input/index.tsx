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
  const { stop, session, messages, status, handleSubmit, model, setModel } = props;
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
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustHeight(e.target);
  }, [setInput, adjustHeight]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
  }, [session, handleSubmit, openAuthDialog]);

  const handleButtonClick = useCallback((e: React.MouseEvent) => {
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
  }, [status, stop, session, handleSubmit, openAuthDialog]);

  // Memoize wrapper class
  const wrapperClass = useMemo(() => 
    messages.length === 0
      ? cn(
          "size-full flex items-center justify-center",
          messages.length > 0 ? "" : ""
        )
      : "",
    [messages.length]
  );

  return (
    <div className={wrapperClass}>
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          "w-full px-auto px-3 mb-1 bg-transparent"
        )}
      >
        {messages.length === 0 && status === "ready" && <MessageTemplate />}
        
        <div className={cn(
          "relative",
          "border border-stone-700 text-black",
          "flex flex-row mx-auto w-full max-w-[800px]"
        )}>
          <div className="flex flex-row w-full bg-stone-50">
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
            className="flex items-center justify-center bg-stone-700 p-1 px-2"
          >
            {status === "ready" ? (
              <ArrowUp size={24} color="white" />
            ) : (
              <CircleStop size={24} color="white" />
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