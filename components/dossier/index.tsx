"use client";

import { cn } from "@/lib/utils";
import { memo } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import { BlankDocument } from "./dossier-blank";
import { DossierNavigation } from "./dossier-navigation";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { DossierSheet } from "@/components/dossier/dossier-sheet";
import { DossierCode } from "@/components/dossier/dossier-code";
import { DossierPresentation } from "@/components/dossier/_dossier-presentation";
import { DossierPdf } from "@/components/dossier/_dossier-pdf";
import { DossierForm } from "@/components/dossier/_dossier-form";

function PureDossier(props: any) {
  const { messages = [] } = props;

  const {
    dossierOpen,
    documents,
    activeTab,
    getDocument,
    updateDocumentContent,
  } = useDossierStore();

  const activeDocument =
    activeTab && activeTab !== "home" ? getDocument(activeTab) : null;

  const displayContent = activeDocument
    ? activeDocument.content + activeDocument.streamingContent
    : "";

  const handleContentChange = (content: string) => {
    if (activeDocument) {
      updateDocumentContent(activeDocument.id, content);
    }
  };

  const renderContent = () => {
    if (activeTab === "home" || !activeDocument) {
      return <BlankDocument messages={messages} />;
    }

    switch (activeDocument.kind) {
      case "text":
        return (
          <SimpleEditor
            content={displayContent}
            handleContentChange={handleContentChange}
            readOnly={activeDocument.isStreaming}
          />
        );
      case "sheet":
        return (
          <DossierSheet
            content={displayContent}
            handleContentChange={handleContentChange}
            readOnly={activeDocument.isStreaming}
          />
        );
      case "code":
        return (
          <DossierCode
            content={displayContent}
            handleContentChange={handleContentChange}
            readOnly={activeDocument.isStreaming}
          />
        );
      case "presentation":
        return (
          <DossierPresentation
            content={displayContent}
            handleContentChange={handleContentChange}
            readOnly={activeDocument.isStreaming}
          />
        );
      case "pdf":
        return (
          <DossierPdf
            content={"https://arxiv.org/pdf/1708.08021"}
            handleContentChange={handleContentChange}
            readOnly={/* activeDocument.isStreaming */ false}
            textHighlights={[
              "In this paper we present the design and implementation of Flow",
            ]}
          />
        );
      case "form":
        return (
          <DossierForm
            content={displayContent}
            handleContentChange={handleContentChange}
            readOnly={activeDocument.isStreaming}
          />
        );
      default:
        return <BlankDocument />;
    }
  };

  return (
    <div className={cn("relative flex flex-col size-full")}>
      <DossierNavigation />
      <>{renderContent()}</>
    </div>
  );
}

export const Dossier = memo(PureDossier);
