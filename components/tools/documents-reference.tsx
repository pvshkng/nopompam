import type { Document } from "@/types/document";
import { cn } from "@/lib/utils";

export function DocumentsReference({ result }: { result: Document[] }) {
  return (
    <div className="flex flex-row gap-1">
      {result?.map((doc, i) => (
        <span
          key={i}
          className={cn(
            "text-[10px] font-semibold px-1 border rounded-md bg-violet-100"
          )}
        >
          {doc.title}
        </span>
      ))}
    </div>
  );
}
