"use client";
import { memo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getArtifacts } from "@/lib/mongo/artifact-store";
import { DossierBrowser } from "@/components/dossier/dossier-browser";
import { useDossierStore } from "@/lib/stores/dossier-store";

const template = [
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
];

const PureBlankDocument = (props: any) => {
  const { messages = [] } = props;
  const syncChatDocuments = useDossierStore((state) => state.syncChatDocuments);

  useEffect(() => {
    syncChatDocuments(messages);
  }, [messages, syncChatDocuments]);

  const chatDocuments = useDossierStore((state) => state.chatDocuments);

  return (
    <div className={cn("flex flex-col size-full items-center justify-center")}>
      <p className={cn("text-xs font-semibold text-stone-400")}>
        There's no documents in the dossier yet
      </p>
      <p className={cn("text-xs font-semibold text-stone-300")}>
        Ask nopompam to create one
      </p>
      {/* <p>{chatDocuments.map((d) => <p>{d.title} {d.id}</p>)}</p> */}
    </div>
  );
};

export const BlankDocument = memo(PureBlankDocument);
