import { LoginComponent } from "@/components/login/login-component";
import { LoginDialog } from "@/components/login/login-dialog";
import { cn } from "@/lib/utils";
import GradientBackground from "@/components/_common/GradientBackground/GradientBackground";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { GridBackground } from "@/components/background-grid";
export default async function Login() {
  const session = await auth();
  if (session) {
    redirect("/chat");
  } else {
    return (
      <>
        <div className="flex w-full h-full">
          <GridBackground />
          {/* <div className="max-lg:hidden flex flex-col items-center justify-center h-screen w-[50%] bg-white">
          <LoginPanel />
        </div> */}
          <div
            className={cn(
              "flex flex-col items-center justify-center h-full ",
              "w-full max-lg:w-full",
              "gap-7"
            )}
          >
            <h1 className="font-bold text-stone-600 text-2xl max-lg:text-xl drop-shadow-xl">
              nopompam
            </h1>
            <div className="z-10">
              <LoginComponent />
            </div>

            {/* Caution */}
            <div className="max-w-[300px]">
              <p className="text-center text-xs text-stone-700 ">
                This AI product may occasionally provide{" "}
                <u>inaccurate or inappropriate information</u>. Use your own
                judgement and verify the information provided.
              </p>
              <LoginDialog />
            </div>
          </div>
        </div>
      </>
    );
  }
}
