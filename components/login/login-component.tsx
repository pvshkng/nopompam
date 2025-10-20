"use client";

import "@/components/Login/auth-loader.css";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { login } from "@/lib/actions/auth/login";
import { authClient } from "@/lib/auth-client";

export function LoginComponent() {
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="flex flex-col items-center justify-center gap-4">
        <button
          disabled={loading}
          className={cn(
            "flex items-center justify-center px-2 font-bold",
            "text-sm p-2 text-violet-600 bg-violet-200"
          )}
          onClick={async () => {
            //setLoading(true);
            await authClient.signIn.social({
              provider: "google",
              callbackURL: "/chat",
            });
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
      </div>
    </>
  );
}
