import { cn } from "@/lib/utils";
import React from "react";

export function GridBackground() {
  return (
    <>
      <div
        className="absolute top-0 left-0 z-0 w-full h-full"
        style={{
          pointerEvents: "none",
        }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
        radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
          }}
        />
      </div>
    </>
  );
}
