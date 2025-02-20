/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useChatContext } from "@/components/Chat/ChatContext/ChatContext";
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import Commands from "@/components/Chat/UserInput/Editor/extensions/commands";
import items from "@/components/Chat/UserInput/Editor/extensions/items";
import renderItems from "@/components/Chat/UserInput/Editor/extensions/renderItems";
import "@/components/Chat/UserInput/Editor/extensions/slash.css";

import { useChat } from "@ai-sdk/react";

export default function Editor(props: {
  isEditorActive: any;
  setEditorStatus: any;
  child: any;
}) {

  const { messages, isLoading, input, setInput, handleInputChange, handleSubmit } = props.child;

  const { isEditorActive, setEditorStatus } = props;
  const [isSlashCommandActive, setIsSlashCommandActive] = useState(false);
  const {
    userInput,
    setUserInput,
    handleSend,
    usecase,
    setUsecase,
    //isLoading,
  } = useChatContext();

  const extensions = [
    StarterKit,
    Placeholder.configure({
      placeholder: "Type / for commands!",
      emptyEditorClass:
        "text-gray-500 relative before:content-[attr(data-placeholder)] before:absolute before:left-0 before:top-0 before:pointer-events-none before:opacity-50",
    }),
    Commands.configure({
      suggestion: {
        items: (props: any) => items({ ...props, setUsecase: setUsecase }),
        //render: renderItems,

        // @ts-ignore
        render: (_props: any) => {
          const renderer = renderItems();
          return {
            // @ts-ignore
            onStart: (...args: any) => {
              setIsSlashCommandActive(true);
              // @ts-ignore
              renderer.onStart(...args);
            },
            // @ts-ignore
            onExit: (...args: any) => {
              setIsSlashCommandActive(false);
              // @ts-ignore
              renderer.onExit(...args);
            },
            // ... rest of your render configuration
          };
        },
      },
    }),
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: extensions,
    //content: content,
    editorProps: {
      attributes: {
        autofocus: "true",
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl focus:outline-none"
        ),
      },
    },
  });

  useEffect(() => {
    console.log("editor?.isInitialized = ", editor?.isInitialized);
    if (editor?.isInitialized) {
      setEditorStatus(true);
    }
  }, [editor?.isInitialized, isEditorActive, setEditorStatus]);

  return editor?.isInitialized ? (
    <EditorContent
      className={
        cn(
          "w-full h-auto max-h-[150px]",
          "text-sm break-all !outline-none !border-none bg-transparent resize-none overflow-auto",
          "transition-all placeholder:truncate"
        )
        //"text-sm break-all outline-none border-none bg-transparent mx-4 my-2 w-full h-auto resize-none overflow-auto transition-all placeholder:truncate"
      }
      disabled={isLoading}
      editor={editor}
      onInput={(e) => {
        setInput(e.currentTarget.innerText);
      }}
      //onChange={handleInputChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey && !isLoading) {
          if (!isSlashCommandActive) {
            e.preventDefault();
            //handleSend(userInput, usecase);
            handleSubmit();
            editor?.commands.clearContent();
          }
        }
      }}
    />
  ) : (
    <></>
  );
}
