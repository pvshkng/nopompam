import Link from "next/link";
import { GridBackground } from "@/components/background-grid";

export default function NotFound({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center size-full">
      <GridBackground />

      <h1 className="z-10 text-stone-400 text-4xl font-semibold">Not found</h1>
      <Link href="/" className="z-10 text-stone-400 text-md font-semibold underline">
        Return home
      </Link>
    </div>
  );
}
