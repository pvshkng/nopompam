"use client";
import { memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";
import { useState, useRef } from "react";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import "./UserInputFading.css";
import { UserInputOptions } from "./user-input-options";
import { MessageTemplate } from "@/components/chat/message-area/message-template";

function PureUserInput(props: any) {
  const {
    messages,
    status,
    isLoading,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    dossierOpen,
    setDossierOpen,
    model,
    setModel,
  } = props;

  const { suggestions } = props;
  const [isEditorActive, setEditorStatus] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* useEffect(() => {
    let input = document.getElementById("userInput");
    input?.addEventListener("keypress", handleKeypress);
    return () => {
      input?.removeEventListener("keypress", handleKeypress);
    };
  }, [handleKeypress]); */

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
        {messages.length === 0 && <MessageTemplate setInput={setInput} />}
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
              onChange={handleInputChange}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                  inputRef.current!.style.height = "auto";
                }
              }}
            />
            {/* input options */}
          </div>
          <button
            onClick={(e) => {
              handleSubmit();
              inputRef.current!.style.height = "auto";
            }}
            disabled={isLoading}
            className={cn(
              "flex items-center justify-center bg-stone-700 p-1 px-2"
            )}
            //hidden={!isEditorActive}
          >
            <PaperPlaneIcon width={24} height={24} color="white" />
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
