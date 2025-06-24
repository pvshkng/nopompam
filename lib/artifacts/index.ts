export const artifactDefinitions = [
    { kind: "textArtifact" },
    { kind: "codeArtifact" },
    { kind: "imageArtifact" },
    { kind: "sheetArtifact" },
];
export type ArtifactKind = (typeof artifactDefinitions)[number]['kind'];
