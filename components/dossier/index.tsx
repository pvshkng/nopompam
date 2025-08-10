"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { CloseIcon } from "@/components/icons/close";
import { CodeEditor } from "./dossier-code-editor";
import { Tiptap } from "@/components/tiptap";
import { memo } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useDossierStore } from "@/lib/stores/dossier-store";

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

  /*  const editorRef = useRef<any>(null);
  useEffect(() => {
    if (streamingContent && editorRef.current) {
      editorRef.current.setMarkdown(streamingContent);
    }
  }, [streamingContent]); */

  /* useEffect(() => {
    return () => {
      if (!dossierOpen) {
        clearStreamingContent();
      }
    };
  }, [dossierOpen, clearStreamingContent]); */

  return (
    <>
      <SimpleEditor content={streamingContent} />
    </>
  );
}

export const Dossier = memo(PureDossier);
