import { cn } from "@/lib/utils";
import { ModelSelector } from "@/components/chat-model-selector";

export const UserInputOptions = (props: any) => {
  const { model, setModel } = props;

  return (
    <>
      <div className={cn("flex", "m-1 h-full w-full", "max-w-[800px]")}>
        <div className="flex flex-row gap-1 my-0 w-full items-center justify-between">
          <div className="flex flex-row h-full gap-1">
            <ModelSelector model={model} setModel={setModel} />
          </div>
          <p className="text-xs text-stone-500">
            Made with ❤︎ by{" "}
            <a href="https://puvish.dev" target="_blank" className="underline">
              puvish.dev
            </a>
          </p>
        </div>
      </div>
    </>
  );
};
