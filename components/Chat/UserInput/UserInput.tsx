"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";
import { useState, useEffect, useRef } from "react";
import UseCaseSelector from "./UseCaseSelector";
import { ModelSelector } from "./model-selector";
import PromptSuggestion from "./PromptSuggestion";
import SuggestionBar from "./SuggestionBar";
import { useChatContext } from "../ChatContext/ChatContext";
import { Separator } from "@/components/ui/_index";
import Editor from "./Editor/Editor";
import EditorLoading from "./EditorLoading/EditorLoading";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { GalleryHorizontalEnd } from "@/components/icons/gallery-horizontal-end";

import { useChat } from "@ai-sdk/react";

interface UserInputProps {
  suggestions?: any;
  child: any;
}

export default function UserInput(props: UserInputProps) {
  const {
    userInput,
    setUserInput,
    //handleSend,
    handleKeypress,
    //isLoading,
    usecase,
    setUsecase,
  } = useChatContext();

  const {
    messages,
    status,
    isLoading,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    canvasOpened,
    isCanvasOpened,
  } = props.child;

  const { suggestions } = props;
  const [isEditorActive, setEditorStatus] = useState(false);

  /* useEffect(() => {
    let input = document.getElementById("userInput");
    input?.addEventListener("keypress", handleKeypress);
    return () => {
      input?.removeEventListener("keypress", handleKeypress);
    };
  }, [handleKeypress]); */

  return (
    <div
      id="userInputWrapper"
      className="flex flex-col items-center justify-center w-full px-auto px-3 mb-8 bg-transparent"
    >
      <div
        className={cn(
          "relative",
          "border border-stone-700 text-black",
          "flex flex-row mx-auto w-full max-w-[800px]"
          //"z-[2] flex flex-col pt-1 pb-0 mx-auto rounded-t-2xl border-1 border-[#302d2c] bg-[#0f0909] text-white w-full max-w-[800px]",
        )}
      >
        <div className="flex flex-row w-full">
          <textarea
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
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          {/* input options */}
        </div>
        <button
          onClick={() => handleSubmit()}
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

      <div
        className={cn(
          "flex",
          "m-1 h-full w-full",
          "border border-stone-700",
          "max-w-[800px]"
        )}
      >
        {/* Index section */}
        <div className="flex flex-row gap-1 my-0">
          <ModelSelector />
          <UseCaseSelector setUsecase={setUsecase} usecase={usecase} />
          <Separator
            className="border-gray-200 h-[15px] my-1"
            orientation="vertical"
          />
          <PromptSuggestion setIsSuggested={"setIsSuggested"} />
          <Separator
            className="border-gray-200 h-[15px] my-1"
            orientation="vertical"
          />
          <button
            onClick={() => {
              isCanvasOpened(!canvasOpened);
            }}
            className="flex flex-row size-[16px] items-center justify-center text-sm text-gray-500 hover:text-gray-700"
          >
            <GalleryHorizontalEnd width={16} height={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
