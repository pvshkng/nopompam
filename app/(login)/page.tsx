import LoginComponent from "@/components/Login/LoginComponent";
import { cn } from "@/lib/utils";
import GradientBackground from "@/components/_common/GradientBackground/GradientBackground";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await auth();
  if (session) {
    redirect("/chat");
  } else {
  return (
    <>
      <div className="flex w-full h-full">
        <GradientBackground />
        {/* <div className="max-lg:hidden flex flex-col items-center justify-center h-screen w-[50%] bg-white">
          <LoginPanel />
        </div> */}
        <div
          className={cn(
            "flex flex-col items-center justify-center h-full ",
            "w-full max-lg:w-full",
            //"bg-gradient-to-br from-mild to-accent",
            "gap-7"
          )}
        >
          <h1 className="font-bold text-white text-2xl max-lg:text-xl drop-shadow-xl">
            Chatai
          </h1>
          <div className="">
            <LoginComponent />
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
  );}

}
