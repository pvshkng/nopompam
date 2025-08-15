import { redirect } from "next/navigation";

import { TestSearchStreaming } from "./test-search-streaming";
import { BlankDocument } from "@/components/dossier/dossier-blank";

export default function TestPage() {
  if (!process.env.THIS_IS_ONLY_FOR_TEST_ENVIRONMENT_YO) {
    redirect("/chat");
  }

  return (
    <>
      <TestSearchStreaming />
      <hr className="w-full my-3" />
      <BlankDocument />
    </>
  );
}
