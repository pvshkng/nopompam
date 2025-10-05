"use client";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { DossierFloating } from "./dossier-floating";
import { BlankDocument } from "./dossier-blank";
import { DossierNavigation } from "./dossier-navigation";
import { useDossierStore } from "@/lib/stores/dossier-store";

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
