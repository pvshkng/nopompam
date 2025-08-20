"use client";

import { useEffect } from "react";
import { GridBackground } from "@/components/background";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center size-full ">
      <GridBackground />
      <h1 className="z-10 text-stone-400 text-4xl font-semibold">Error</h1>
      <button
        onClick={() => reset()}
        className="z-10 text-stone-400 text-md font-semibold underline"
      >
        Try again
      </button>
    </div>
  );
}
