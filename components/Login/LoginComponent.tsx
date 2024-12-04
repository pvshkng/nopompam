"use client";

import "@/components/Login/auth-loader.css";
// import { useSession, signIn as adSignin } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Separator } from "@/components/ui/_index";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { login } from "@/lib/actions/auth/login";
import GradientBackground from "@/components/_common/GradientBackground/GradientBackground";
import { signIn } from "@/auth";

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
              //"lg:text-xl lg:px-3 lg:py-2 lg:gap-3"
            )}
            onClick={async () => {
              setLoading(true);
              await login();
              // 'use server'
              //await signIn("google", { redirect: true, redirectTo: "/chat" });
              //adSignin("azure-ad", { redirect: true, callbackUrl: "/chat" });
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
