import { cn } from "@/lib/utils";
import { BookCheckIcon, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export const TLDR = ({ children }: { children: React.ReactNode }) => {
  const [isStreaming, setIsStreaming] = useState(true);

  useEffect(() => {
    // If children exists and is not empty, streaming is complete
    if (children && children.toString().trim().length > 0) {
      setIsStreaming(false);
    }

    // Optional: Add a timeout to ensure we catch the end of streaming
    const timeoutId = setTimeout(() => {
      setIsStreaming(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [children]);

  return (
    <span
      className={cn(
        "flex flex-col w-full px-4 py-3 gap-2 my-2",
        "border border-stone-300 rounded-md bg-neutral-100",
        "text-stone-500"
      )}
    >
      <span className="text-xs flex flex-row items-center gap-2">
        {isStreaming ? (
          <LoaderCircle size={16} className="!animate-spin !opacity-100" />
        ) : (
          <BookCheckIcon size={16} />
        )}
        TL;DR
      </span>
      {children}
    </span>
  );
};
