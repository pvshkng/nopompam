"use client";

import Research from "@/components/tools/research";


export default function Playground({ searchParams }: { searchParams: any }) {
  return (
    <Research tool={{ state: "output-available", type: "tool-research" }} />
  );
}
