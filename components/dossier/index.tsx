"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { CloseIcon } from "@/components/icons/close";
import { CodeEditor } from "./dossier-code-editor";
import { Tiptap } from "@/components/tiptap/editor";
import { ForwardRefEditor } from "@/components/editor";
import { memo } from "react";

import { useDossierStore } from "@/lib/stores/dossier-store";
import { headingsPlugin, markdownShortcutPlugin } from "@mdxeditor/editor";

function PureDossier(props: any) {
  const {
    openDossier,
    setStreamingContent,
    setIsStreaming,
    appendStreamingContent,
    switchTab,
    streamingContent,
    dossierOpen,
    clearStreamingContent,
  } = useDossierStore();

  const editorRef = useRef<any>(null);
  useEffect(() => {
    if (streamingContent && editorRef.current) {
      editorRef.current.setMarkdown(streamingContent);
    }
  }, [streamingContent]);

  useEffect(() => {
    return () => {
      if (!dossierOpen) {
        clearStreamingContent();
      }
    };
  }, [dossierOpen, clearStreamingContent]);

  return (
    <>
      <textarea
        className="h-full"
        value={streamingContent}
        onChange={() => {}}
      />

      {/* <ForwardRefEditor
        ref={editorRef}
        markdown={streamingContent}
        //plugins={[headingsPlugin(), markdownShortcutPlugin()]}
        onChange={(e) => {
          console.log(e);
          setStreamingContent(e);
        }}
        autoFocus={true}
        //className=""
        contentEditableClassName="max-h-dvh overflow-scroll"
      /> */}
    </>
  );
}

export const Dossier = memo(PureDossier);
