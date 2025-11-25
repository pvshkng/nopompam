import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";
import { cn } from "@/lib/utils";

// TODO:
// [Shiki] 10 instances have been created.\
// Shiki is supposed to be used as a singleton,
// consider refactoring your code to cache your highlighter instance;
// Or call `highlighter.dispose()` to release unused instances.

export function MonacoWithShiki() {
  const editorRef = useRef(null);

  useEffect(() => {
    async function setupShiki() {
      // Create a Shiki highlighter
      const highlighter = await createHighlighter({
        themes: ["github-light"],
        langs: ["javascript", "typescript", "html", "css"],
      });

      // Register Shiki themes and languages with Monaco
      // @ts-ignore
      // TODO: fix type
      shikiToMonaco(highlighter, window.monaco);
    }

    setupShiki();
  }, []);
  
  // @ts-ignore
  // TODO: fix type
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <Editor
      className={cn(
        "size-full",
        "[&_*]:!border-none",
        "[&_pre_.line]:relative",
        "[&_pre_.line]:before:content-[attr(data-line)]",
        "[&_pre_.line]:before:absolute",
        "[&_pre_.line]:before:left-0",
        "[&_pre_.line]:before:text-zinc-400",
        "[&_pre_.line]:before:w-4",
        "[&_pre_.line]:before:text-right",
        "[&_pre_.line]:before:select-none"
      )}
      height={undefined}
      defaultLanguage="sql"
      defaultValue="// Write your code here"
      theme="github-light"
      onMount={handleEditorDidMount}
    />
  );
}
