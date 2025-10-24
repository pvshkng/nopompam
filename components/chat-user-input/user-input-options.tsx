import { cn } from "@/lib/utils";
import { ModelSelector } from "@/components/chat-model-selector";
import { GalleryHorizontalEnd } from "@/components/icons/gallery-horizontal-end";
import { Attachment } from "./attachment";
import { Cog } from "lucide-react";
import { useState } from "react";
import { LLMDrawer } from "../prototype/llm-drawer";
export const UserInputOptions = (props: any) => {
  const { dossierOpen, setDossierOpen, model, setModel } = props;
  const [optionOpen, setOptionOpen] = useState(false);
  return (
    <>
      <div
        className={cn(
          "flex",
          "m-1 h-full w-full",
          //"border border-stone-700",
          "max-w-[800px]"
        )}
      >
        {/* Index section */}
        <div className="flex flex-row gap-1 my-0 w-full items-center justify-between">
          <div className="flex flex-row h-full gap-1">
            <ModelSelector model={model} setModel={setModel} />
            <Attachment />
            {/* <button
              className={cn(
                "gap-1",
                "flex flex-row bg-stone-700 size-[16px] items-center justify-center",
                "text-sm text-gray-500 hover:text-gray-700 h-full w-8"
              )}
              onClick={() => {
                setOptionOpen(true);
              }}
            >
              <Cog width={16} height={16} stroke={"white"} />
            </button> */}
          </div>
          <p className="text-xs text-stone-500">
            Made with ❤︎ by{" "}
            <a href="https://puvish.dev" target="_blank" className="underline">
              puvish.dev
            </a>
          </p>
        </div>
      </div>
      <LLMDrawer open={optionOpen} onOpenChange={setOptionOpen} />
    </>
  );
};
