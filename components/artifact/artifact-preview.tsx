import { cn } from "@/lib/utils";
import "@/styles/streaming-effect.css";
import { NotebookPen, LoaderCircle } from "lucide-react";
import { ToolInvocation } from "ai";

type ArtifactPreviewProps = {
  toolInvocation: ToolInvocation;
  artifactId: string;
  artifacts: any[];
  setArtifacts: any;
  dossierOpen: boolean;
  setDossierOpen: any;
  activeTab: any;
  setActiveTab: any;
};

export function ArtifactPreview(props: ArtifactPreviewProps) {
  const {
    toolInvocation,
    artifactId,
    artifacts,
    setArtifacts,
    dossierOpen,
    setDossierOpen,
    activeTab,
    setActiveTab,
  } = props;
  const artifact =
    artifacts.find((a) => a.artifactId === artifactId) || undefined;

  return (
    <div
      className={cn(
        "stream-section",
        "cursor-pointer",
        "flex flex-col w-full px-4 py-3 gap-2 my-2",
        "border border-stone-300 rounded-md bg-neutral-100"
      )}
      onClick={() => {
        setActiveTab(artifactId);
        setDossierOpen(true);
      }}
    >
      {artifact ? (
        <>
          {/* <div className="font-bold mb-1">{artifact.title}</div> */}
          <span className="flex flex-row text-stone-500 items-center gap-2">
            {toolInvocation?.state !== "result" ? (
              <LoaderCircle size={16} className="!animate-spin !opacity-100" />
            ) : (
              <NotebookPen size={16} />
            )}
            {artifact.title}
          </span>
          <pre className="whitespace-pre-wrap max-h-[150px] overflow-auto text-xs">
            {artifact.content}
          </pre>
        </>
      ) : (
        <div>
          <button
            onClick={() => {
              console.log("ID: ", artifactId);
            }}
          >
            Loading...
          </button>
        </div>
      )}
    </div>
  );
}
