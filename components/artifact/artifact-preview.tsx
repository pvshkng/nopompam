//import { useArtifactStore } from "@/lib/hooks/use-artifact-store";

export function ArtifactPreview({
  artifactId,
  artifacts,
  setArtifacts,
}: {
  artifactId: string;
  artifacts: any[];
  setArtifacts: any;
}) {
  //const artifact = useArtifactStore((state) => state.artifacts[artifactId]);

  //if (!artifact) return null;

  // look up artifact from artifactId
  const artifact = artifacts.find((a) => a.id === artifactId) || undefined;

  return (
    <div className="border rounded p-2 mt-2 bg-neutral-50">
      {artifact ? (
        <>
          <div className="font-bold mb-1">{artifact.title}</div>
          <pre className="whitespace-pre-wrap">{artifact.content}</pre>
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
