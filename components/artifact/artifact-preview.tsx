import '../Chat/message-area/streaming-effect.css'
export function ArtifactPreview({
  artifactId,
  artifacts,
  setArtifacts,
}: {
  artifactId: string;
  artifacts: any[];
  setArtifacts: any;
}) {

  const artifact = artifacts.find((a) => a.artifactId === artifactId) || undefined;

  return (
    <div className="stream-section border rounded p-2 mt-2 bg-neutral-50 mb-4">
      {artifact ? (
        <>
          <div className="font-bold mb-1">{artifact.title}</div>
          <pre className="whitespace-pre-wrap max-h-[200px] overflow-auto">{artifact.content}</pre>
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
