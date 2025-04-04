"use client";

import "@/components/Login/auth-loader.css";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { login } from "@/lib/actions/auth/login";

export default function LoginComponent() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <HoverBorderGradient
          duration={0.5}
          className={cn(
            "bg-gradient-to-br",
            !loading
              ? "from-orange-200 to-orange-800"
              : "from-gray-300 to-gray-600",
            !loading && "active:from-orange-300 active:to-orange-900",
            "shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]"
          )}
        >
          <button
            disabled={loading}
            className={cn(
              "flex items-center justify-center px-2 font-bold",
              "text-sm p-2 text-white"
            )}
            onClick={async () => {
              //setLoading(true);
              await login();
            }}
          >
            <div className="flex flex-row gap-2 min-h-[28px] min-w-[200px] px-2 items-center justify-center">
              {loading ? (
                <div className="auth-loader mt-2" />
              ) : (
                <div className="flex flex-row gap-2">
                  <Image
                    src={"/icon/google.png"}
                    alt="microsoft logo"
                    width={20}
                    height={20}
                  />
                  Login with Google
                </div>
              )}
            </div>
          </button>
        </HoverBorderGradient>
      </div>
    </>
  );
}
