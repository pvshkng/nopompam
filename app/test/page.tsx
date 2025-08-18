import { redirect } from "next/navigation";

import { TestSearchStreaming } from "./test-search-streaming";
import { BlankDocument } from "@/components/dossier/dossier-blank";
import { GradientText } from "@/components/chat/message-area/message-gradient-text";
import "@/styles/pulse.css";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  QuestionMarkCircledIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";

export default function TestPage() {
  if (!process.env.THIS_IS_ONLY_FOR_TEST_ENVIRONMENT_YO) {
    redirect("/chat");
  }

  return (
    <>
      <TestSearchStreaming />
      <hr className="w-full my-3" />
      <BlankDocument />
      <div className="flex flex-col w-full justify-center items-center my-4 p-4">
        <div className="flex flex-row gap-2 items-center mx-4">
          <div className="pulse-loader flex !size-5 max-h-5 max-w-5 bg-transparent">
            <img
              src="/avatar/furmata.png"
              height={20}
              width={20}
              alt="avatar"
              className="animate-spin rounded-full"
            />
          </div>
          <GradientText text="Thinking..." className="text-sm mx-2 font-bold" />
        </div>

        <hr className="w-full my-3" />

        <div className="flex flex-row gap-2 items-center mx-4">
          <div className="pulse-loader max-h-1 max-w-1" />
          <GradientText text="Thinking..." className="text-sm mx-2 font-bold" />
        </div>
      </div>

      <hr className="w-full my-3" />

      <div className="flex flex-col max-w-[800px] w-full justify-center items-center my-4 p-4 mx-auto">
        <div
          className={cn(
            "flex flex-row w-full justify-between items-center",
            "rounded-lg p-2 my-1",
            "bg-stone-200",
            "cursor-pointer",
            "transition-all hover:-translate-y-1 hover:shadow-md"
          )}
        >
          <span className={cn("font-medium text-stone-500 text-xs truncate")}>
            Follow up questionFo questionFollow up questionFollow up
            questionFollow up question
          </span>
          <ArrowRight className="min-w-4 min-h-4 size-4 text-stone-500" />
        </div>
      </div>
    </>
  );
}
