import { cn } from "@/lib/utils";
import { ModelSelector } from "@/components/chat/model-selector";
import { GalleryHorizontalEnd } from "@/components/icons/gallery-horizontal-end";
import { Attachment } from "./attachment";

export const UserInputOptions = (props: any) => {
  const { dossierOpen, setDossierOpen, model, setModel } = props;
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
          </div>
        </div>
      </div>
    </>
  );
};
