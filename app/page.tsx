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
import { signIn } from "@/auth";

export default function Login() {
  // const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const LoginPanel = () => (
    <>
      {/* GGL */}
      {/* <form
        action={async () => {
          "use server";
          await signIn();
        }}
      >
        <button type="submit">Signin with Google</button>
      </form> */}

      <div
        className={cn(
          "relative h-full w-full flex-1 overflow-hidden",
          "flex flex-col items-center justify-center",
          "p-8 border rounded-md bg-white",
          "max-lg:p-2 max-lg:bg-transparent max-lg:border-none"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <HoverBorderGradient
            duration={0.5}
            className={cn(
              "bg-gradient-to-br",
              !loading
                ? "from-green-200 to-green-800"
                : "from-gray-300 to-gray-600",
              !loading && "active:from-green-300 active:to-green-900",
              "shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px]"
            )}
          >
            <button
              disabled={loading}
              className={cn(
                "flex items-center justify-center px-2 font-bold",
                "text-sm p-2 text-white "
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
              <div className="flex flex-row gap-2 min-h-[28px] min-w-[230px] items-center justify-center">
                {loading ? (
                  <div className="auth-loader mt-2" />
                ) : (
                  <>
                    <Image
                      src={"/icon/microsoft.svg"}
                      alt="microsoft logo"
                      width={20}
                      height={20}
                    />
                    Login with Microsoft Account
                  </>
                )}
              </div>
            </button>
          </HoverBorderGradient>
        </div>
      </div>
    </>
  );

  /*   if (status === "authenticated") {
    router.push("/chat");
  } else if (status === "unauthenticated") { */
  return (
    <>
      <div className="flex w-full h-full">
        <div className="max-lg:hidden flex flex-col items-center justify-center h-screen w-[50%] bg-white">
          <LoginPanel />
        </div>
        <div
          className={cn(
            "flex flex-col items-center justify-center h-full ",
            "w-[50%] max-lg:w-full",
            "bg-gradient-to-br from-mild to-accent",
            "gap-7"
          )}
        >
          <div className={cn("flex flex-row items-center justify-center")}>
            <Image
              src="/logo/nav-logo.svg"
              className="drop-shadow-xl"
              alt="logo"
              width={200}
              height={50}
            />
            <Separator orientation="vertical" className="mx-4" />
            <Image
              src="/logo/KBTG.svg"
              className="drop-shadow-xl rounded-[1px]"
              alt="logo"
              width={100}
              height={50}
            />
          </div>
          <h1 className="font-bold text-white text-2xl max-lg:text-xl drop-shadow-xl">
            GEDI Generative AI Chatbot
          </h1>
          <div className="lg:hidden ">
            <LoginPanel />
          </div>

          {/* Caution */}
          <div className="max-w-[300px]">
            <p className="text-center text-xs text-gray-200 ">
              This AI product may occasionally provide{" "}
              <u>inaccurate or inappropriate information</u>. Use your own
              judgement and verify the information provided.
            </p>
          </div>
        </div>
      </div>
    </>
  );
  /* } */
}
