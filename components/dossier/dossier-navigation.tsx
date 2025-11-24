import { useDossierStore } from "@/lib/stores/dossier-store";
import { memo } from "react";
import { X, House, NotebookPen, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveArtifact } from "@/lib/mongo/artifact-store";

const PureDossierNavigation = (props: any) => {
  const {
    closeDossier,
    setActiveTab,
    activeTab,
    documents,
    closeTab,
    markDocumentSaved,
    getDocument,
    removeDocument,
  } = useDossierStore();

  const isActive = (tabName: string) => {
    return activeTab === tabName;
  };

  const handleTabClose = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    const closed = closeTab(docId);
    if (closed) {
      removeDocument(docId);
    }
  };

  const handleSave = async () => {
    if (activeTab && activeTab !== "home") {
      const doc = getDocument(activeTab);
      if (doc?.hasUnsavedChanges) {
        // TODO handle error & toast
        try {
          await saveArtifact(doc.id, doc.kind, doc.title, doc.content);
          markDocumentSaved(activeTab);
        } catch (error) {
          console.error("Save failed:", error);
        }
      }
    }
  };

  const activeDocument =
    activeTab && activeTab !== "home" ? getDocument(activeTab) : null;
  const canSave = activeDocument?.hasUnsavedChanges;

  return (
    <div
      className={cn(
        "p-0 min-w-0",
        "flex flex-row items-center justify-between",
        "border-b border-stone-200",
        "bg-neutral-50"
      )}
    >
      {/* TABS */}
      <div className={cn("flex flex-row p-1 pb-0 h-full gap-1 flex-1 min-w-0")}>
        {/* Home Tab */}
        <button
          className={cn(
            "flex items-center justify-center min-w-7 border m-0 p-1 border-b-0",
            isActive("home") &&
              "border-stone-300 max-w-full bg-white shadow-[0px_1px_0px_1px_#FFFFFF]"
          )}
          onClick={() => {
            setActiveTab("home");
          }}
        >
          <House
            className={cn(
              "w-4 h-4",
              isActive("home") ? "stroke-stone-500" : "stroke-stone-200"
            )}
          />
        </button>

        {/* Dynamic Document Tabs */}
        {documents.map((doc) => (
          <div
            key={doc.id}
            className={cn(
              "relative group",
              "flex flex-row flex-shrink items-center justify-center",
              "overflow-hidden",
              "min-w-0 max-w-48",
              "border m-0 border-b-0",
              isActive(doc.id) &&
                "border-stone-300 bg-white shadow-[0px_1px_0px_0px_#FFFFFF]",
              !isActive(doc.id) && "border-stone-200"
            )}
          >
            <button
              className={cn(
                "flex flex-row items-center gap-1 p-1 pr-0 flex-1 min-w-0"
              )}
              onClick={() => {
                setActiveTab(doc.id);
              }}
            >
              <div className="flex items-center gap-1 min-w-0">
                {doc.isStreaming ? (
                  <Loader2 className="w-4 h-4 animate-spin stroke-blue-500" />
                ) : (
                  <NotebookPen
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isActive(doc.id) ? "stroke-stone-500" : "stroke-stone-200"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-xs truncate",
                    isActive(doc.id) ? "text-stone-500" : "text-stone-200"
                  )}
                >
                  {doc.title}
                </span>
                {doc.hasUnsavedChanges && (
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0"
                    )}
                  />
                )}
              </div>
            </button>

            {/* Close button - only show on hover or if active */}
            <button
              className={cn(
                "p-1 opacity-0 group-hover:opacity-100 transition-opacity",
                isActive(doc.id) && "opacity-100"
              )}
              onClick={(e) => handleTabClose(e, doc.id)}
            >
              <X className="w-3 h-3 stroke-stone-400 hover:stroke-stone-600" />
            </button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className={cn("p-1 flex flex-row items-center justify-end gap-1")}>
        <button
          className={cn(
            "border m-0 p-1",
            canSave
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-stone-400 cursor-not-allowed",
            "transition-colors"
          )}
          onClick={handleSave}
          disabled={!canSave}
        >
          <Save size={16} className="stroke-stone-100" />
        </button>
        <button
          className={cn(
            "border m-0 p-1 bg-stone-700 hover:bg-stone-800 transition-colors"
          )}
          onClick={() => {
            closeDossier();
          }}
        >
          <X size={16} className="stroke-stone-100" />
        </button>
      </div>
    </div>
  );
};

export const DossierNavigation = memo(PureDossierNavigation);
