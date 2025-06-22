import { Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { memo } from "react";
const PureAttachment = () => (
  <>
    <div className="h-full">
      <button className="flex bg-stone-700 flex-row size-[16px] items-center justify-center text-sm text-gray-500 hover:text-gray-700 h-full w-8">
        <Paperclip width={16} height={16} stroke={"white"} />
      </button>
    </div>
  </>
);

export const Attachment = memo(PureAttachment);
