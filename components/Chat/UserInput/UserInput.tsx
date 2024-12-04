"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";
import { useState, useEffect, useRef } from "react";
import UseCaseSelector from "./UseCaseSelector";
import PromptSuggestion from "./PromptSuggestion";
import SuggestionBar from "./SuggestionBar";
import { useChatContext } from "../ChatContext/ChatContext";
import { Separator } from "@/components/ui/_index";
import Editor from "./Editor/Editor";
import EditorLoading from "./EditorLoading/EditorLoading";

interface UserInputProps {
  suggestions?: any;
}

export default function UserInput(props: UserInputProps) {
  const {
    userInput,
    setUserInput,
    handleSend,
    handleKeypress,
    isLoading,
    usecase,
    setUsecase,
  } = useChatContext();

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
      className="z-[3] flex flex-col items-center justify-center w-full px-auto px-5 mb-8 bg-transparent"
    >
      <div
        className={cn(
          "relative bg-gradient-to-r from-neutral-900 to-stone-800",
          "border-1 border-[#302d2c] text-white ",
          "z-[2] flex flex-col py-3 mx-auto rounded-2xl w-full max-w-[800px]",
          "shadow-[0_0px_20px_rgba(232,78,49,0.1)]"
          //"z-[2] flex flex-col pt-1 pb-0 mx-auto rounded-t-2xl border-1 border-[#302d2c] bg-[#0f0909] text-white w-full max-w-[800px]",
        )}
      >
        <div className="px-4 flex flex-row">
          {!isEditorActive && <EditorLoading />}
          {/* <textarea
              autoFocus
              autoComplete="off"
              rows={1}
              placeholder="Type / for commands"
              className={cn(
                "text-sm break-all outline-none border-none bg-transparent mx-4 my-2 w-full h-auto resize-none overflow-auto transition-all placeholder:truncate"
              )}
              id="userInput"
              value={userInput}
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(
                  e.target.scrollHeight,
                  150
                )}px`;
                setUserInput(e.target.value);
              }}
            /> */}

          <Editor
            isEditorActive={isEditorActive}
            setEditorStatus={setEditorStatus}
          />

          {isEditorActive && (
            <button
              onClick={() => handleSend()}
              disabled={isLoading}
              className=""
              hidden={!isEditorActive}
            >
              <Image src="/icon/enter.svg" width={24} height={24} alt="send" />
            </button>
          )}
        </div>

        {/* Index section */}
        {/* <div className="flex items-center m-2 gap-1 my-0 border-t-2">
            <UseCaseSelector setUsecase={setUsecase} usecase={usecase} />
            <Separator
              className="border-gray-200 h-[15px] my-1"
              orientation="vertical"
            />
            <PromptSuggestion setIsSuggested={setIsSuggested} />
          </div> */}
      </div>
    </div>
  );
}
