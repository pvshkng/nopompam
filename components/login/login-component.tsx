"use client";

import "@/components/Login/auth-loader.css";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { login } from "@/lib/actions/auth/login";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuthDialogStore } from "@/lib/stores/auth-dialog-store";
import { useShallow } from "zustand/react/shallow";

export function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const { close } = useAuthDialogStore(
    useShallow((state) => ({
      close: state.close,
    }))
  );

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data, error } = await authClient.signIn.username({
        username: event.currentTarget.email.value,
        password: event.currentTarget.password.value,
        callbackURL: "/chat",
      });

      if (error) {
        setError(error.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }
      if (data) {
        close();
        router.push("/");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <form onSubmit={onSubmit} className="space-y-4 w-full">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs text-stone-400">
              Email or username
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="hello@example.com"
              type="text"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-xs text-stone-400">
                Password
              </Label>
            </div>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center w-full bg-stone-200 p-2 rounded-none text-stone-500 text-sm font-bold hover:bg-stone-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            disabled={loading}
          >
            {loading ? <div className="auth-loader mt-2" /> : "Login"}
          </button>
        </form>

        <div className="relative w-full">
          <div className="relative flex justify-center text-xs uppercase">
            <span className="p-2 text-stone-400">Or continue with</span>
          </div>
        </div>

        <button
          disabled={loading}
          className={cn(
            "flex items-center justify-center font-bold",
            "text-sm p-2 text-stone-500 bg-stone-200 hover:bg-stone-300",
            "disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          )}
          onClick={async () => {
            setLoading(true);
            await authClient.signIn.social({
              provider: "google",
              callbackURL: "/chat",
            });
          }}
        >
          <div className="flex flex-row gap-2 min-h-[28px] min-w-[180px] px-2 items-center justify-center">
            {loading ? (
              <div className="auth-loader mt-2" />
            ) : (
              <div className="flex flex-row gap-2">
                <Image
                  src={"/icon/google.png"}
                  alt="google logo"
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
