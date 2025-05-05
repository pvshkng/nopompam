import React, { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { shikiToMonaco } from "@shikijs/monaco";
import { createHighlighter } from "shiki";
import { cn } from "@/lib/utils";

export function MonacoWithShiki() {
  const editorRef = useRef(null);

  useEffect(() => {
    async function setupShiki() {
      // Create a Shiki highlighter
      const highlighter = await createHighlighter({
        themes: ["github-light"], // Add your preferred themes
        langs: ["javascript", "typescript", "html", "css"], // Add your preferred languages
      });

      // Register Shiki themes and languages with Monaco
      shikiToMonaco(highlighter, window.monaco);
    }

    setupShiki();
  }, []);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  return (
    <Editor
      className={cn(
        //"[&_*]:!bg-stone-800",
        "[&_pre_.line]:relative",
        "[&_pre_.line]:before:content-[attr(data-line)]",
        "[&_pre_.line]:before:absolute",
        "[&_pre_.line]:before:left-0",
        "[&_pre_.line]:before:text-zinc-400",
        "[&_pre_.line]:before:w-4",
        "[&_pre_.line]:before:text-right",
        //"[&_pre_.line]:before:mr-4",
        "[&_pre_.line]:before:select-none"
      )}
      height="100dvh"
      defaultLanguage="sql"
      defaultValue="// Write your code here"
      theme="github-light"
      onMount={handleEditorDidMount}
    />
  );
}
