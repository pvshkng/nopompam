import { cn } from "@/lib/utils";
import { BookCheckIcon } from "lucide-react";
export const Immersive = ({ children }: { children: React.ReactNode }) => {
  return (
    <span
      className={cn(
        "p-2",
        "flex flex-col border border-stone-300 rounded-md bg-neutral-100"
      )}
    >
      <div className="flex flex-row text-stone-500 items-center gap-1">
        <BookCheckIcon size={16} />
        Immersive
      </div>
      {children}
    </span>
  );
};
