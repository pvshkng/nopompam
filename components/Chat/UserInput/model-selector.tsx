import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const models = {
  google: [
    "gemini-2.5-pro",
    "gemini-2.5-pro-preview-05-06",
    "gemini-2.5-flash",
    "gemini-2.5-flash-preview-04-17",
    "gemini-2.5-flash-lite-preview-06-17",
  ],
};

export const ModelSelector = (props: any) => {
  return (
    <div className="px-2 flex bg-stone-700 text-stone-200 overflow-hidden w-24">
      <Select>
        <SelectTrigger className="flex !min-w-0 p-0 m-0 rounded-none border-none text-[10px] overflow-hidden">
          <SelectValue
            placeholder="Model"
            className="!min-w-0 [&_span]:!min-w-0 [&_span]:!truncate [&_span]:max-w-full [&_span]:block"
          />
        </SelectTrigger>

        {Object.keys(models).map((provider) => (
          <SelectContent
            key={provider}
            className={cn(
              "!max-h-[200px] overflow-auto rounded-none",
              "border-stone-800 shadow-none",
              "m-0 p-0"
            )}
          >
            {models[provider].map((model) => (
              <SelectItem
                className="text-[10px] !truncate"
                key={model}
                value={model}
              >
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        ))}

        {/*  <SelectContent>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent> */}
      </Select>
    </div>
  );
};
