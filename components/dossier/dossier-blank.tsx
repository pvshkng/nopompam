"use client";
import { memo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getArtifacts } from "@/lib/mongo/artifact-store";
import { DossierBrowser } from "@/components/dossier/dossier-browser";
import { useDossierStore } from "@/lib/stores/dossier-store";
import { X, House, NotebookPen, Save, Loader2 } from "lucide-react";
import { EmblaCarousel } from "@/components/embla-carousel";
import { EmblaOptionsType } from "embla-carousel";

const template = [
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
  { kind: "text", prompt: ["prompt 1", "prompt 2"] },
];

const iconMapping: Record<string, any> = {
  text: NotebookPen,
  sheet: NotebookPen,
  //image: House,
};

const OPTIONS: EmblaOptionsType = { slidesToScroll: "auto" };
const SLIDE_COUNT = 10;
const SLIDES = Array.from(Array(SLIDE_COUNT).keys());

const PureBlankDocument = (props: any) => {
  const { messages = [] } = props;
  const syncChatDocuments = useDossierStore((state) => state.syncChatDocuments);

  useEffect(() => {
    syncChatDocuments(messages);
  }, [messages, syncChatDocuments]);

  const chatDocuments = useDossierStore((state) => state.chatDocuments);

  return (
    <div className={cn("flex flex-col size-full items-center justify-center")}>
      <p className={cn("text-sm text-stone-400")}>
        Document in this chat
      </p>
      {chatDocuments.length > 0 ? (
        <>
          <div className={cn("flex flex-row", "w-full gap-1 m-1 p-4")}>
            <EmblaCarousel slides={chatDocuments} options={OPTIONS} />
            {/* {chatDocuments.map((d, i) => (
              <div
                key={i}
                className="w-32 p-1 bg-neutral-50 rounded-sm shadow-md"
              >
                <span className="text-xs">{d.title}</span>
              </div>
            ))} */}
          </div>
        </>
      ) : (
        <>
          <p className={cn("text-xs font-semibold text-stone-400")}>
            There's no documents in the dossier yet
          </p>
          <p className={cn("text-xs font-semibold text-stone-300")}>
            Ask nopompam to create one
          </p>
        </>
      )}

      {/* <p>{chatDocuments.map((d) => <p>{d.title} {d.id}</p>)}</p> */}
    </div>
  );
};

export const BlankDocument = memo(PureBlankDocument);
