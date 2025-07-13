import { cn } from "@/lib/utils";
import "../chat/message-area/streaming-effect.css";

type ArtifactPreviewProps = {
  artifactId: string;
  artifacts: any[];
  setArtifacts: any;
  dossierOpen: boolean;
  setDossierOpen: any;
};

export function ArtifactPreview(props: ArtifactPreviewProps) {
  const {
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
        "stream-section border rounded p-2 bg-neutral-50 m-2",
        "cursor-pointer"
      )}
      onClick={() => {
        setActiveTab(artifactId);
        setDossierOpen(true);
      }}
    >
      {artifact ? (
        <>
          <div className="font-bold mb-1">{artifact.title}</div>
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
