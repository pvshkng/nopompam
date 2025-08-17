import { redirect } from "next/navigation";

import { TestSearchStreaming } from "./test-search-streaming";
import { BlankDocument } from "@/components/dossier/dossier-blank";
import { GradientText } from "@/components/chat/message-area/message-gradient-text";
import "@/styles/pulse.css";

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
    </>
  );
}
