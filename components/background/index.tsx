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
        {/* Top Fade Grid Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        linear-gradient(to right, #e2e8f0 1px, transparent 1px),
        linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
      `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          }}
        />
      </div>
    </>
  );
}
