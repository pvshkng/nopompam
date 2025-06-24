import { textDocumentHandler } from './text/server';

export const artifactKinds = ['text'] as const;
export const documentHandlersByArtifactKind = [
  textDocumentHandler,
];
/* export function createArtifactHandler(config: { kind, onCreateArtifact, onUpdateArtifact }) {

} */