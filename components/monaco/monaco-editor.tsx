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
        themes: ["kanagawa-dragon"], // Add your preferred themes
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
      className={cn("[&_pre]:!bg-stone-600",)}
      height="100dvh"
      defaultLanguage="sql"
      defaultValue="// Write your code here"
      theme="kanagawa-dragon"
      onMount={handleEditorDidMount}
    />
  );
}
