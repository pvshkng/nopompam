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
        "bg-black/5 backdrop-blur-sm border border-white/50 rounded-lg shadow-[inset_0_1px_0px_rgba(255,255,255,0.75),0_0_9px_rgba(0,0,0,0.2),0_3px_8px_rgba(0,0,0,0.15)] ",
        //"before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
        //"after:absolute after:inset-0 after:rounded-lg after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none",
        "p-6 relative",
        "flex flex-col w-full px-4 py-3 gap-2 my-2",
        "text-violet-700"
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
      <span>{children}</span>
    </span>
  );
};
