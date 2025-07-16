import { GridBackground } from "@/components/background-grid";
import { Experiment } from "./experiment";
import { redirect } from "next/navigation";

export default async function Playground({
  searchParams,
}: {
  searchParams: any;
}) {
  const secret = await searchParams.secret;

  if (secret !== "booboolovesmoojiw") {
    redirect("/404");
  }

  return (
    <div className="flex flex-col items-center justify-center size-full">
      <GridBackground />
      <Experiment />
    </div>
  );
}
