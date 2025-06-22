import { cn } from "@/lib/utils";

import UseCaseSelector from "./UseCaseSelector";
import { ModelSelector } from "./model-selector";
import PromptSuggestion from "./PromptSuggestion";
import SuggestionBar from "./SuggestionBar";
import { Separator } from "@/components/ui/_index";
import { GalleryHorizontalEnd } from "@/components/icons/gallery-horizontal-end";
import { Attachment } from "./attachment";
export const UserInputOptions = (props: any) => {
  const { canvasOpened, isCanvasOpened } = props;
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
            <ModelSelector />
            <Attachment />
          </div>
          {/* <UseCaseSelector setUsecase={setUsecase} usecase={usecase} />
          <Separator
            className="border-gray-200 h-[15px] my-1"
            orientation="vertical"
          />
          <PromptSuggestion setIsSuggested={"setIsSuggested"} />
          <Separator
            className="border-gray-200 h-[15px] my-1"
            orientation="vertical"
          /> */}
          <div className="h-full">
            <button
              onClick={() => {
                isCanvasOpened(!canvasOpened);
              }}
              className="flex bg-stone-700 flex-row size-[16px] items-center justify-center text-sm text-gray-500 hover:text-gray-700 h-full w-8"
            >
              <GalleryHorizontalEnd width={16} height={16} stroke={"white"} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
