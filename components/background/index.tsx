import { cn } from "@/lib/utils";
import React from "react";
import { Dtx } from "./dtx";

export function GridBackground() {
  return (
    <>
      <div
        className="absolute top-0 left-0 z-0 w-full h-full"
        style={{
          pointerEvents: "none",
        }}
      >
        <Dtx />
        {/* Purple Corner Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        radial-gradient(circle 600px at 0% 200px, #d5c5ff, transparent),
        radial-gradient(circle 600px at 100% 200px, #d5c5ff, transparent)
      `,
          }}
        />
        {/* Your Content Here */}
      </div>
    </>
  );
}
