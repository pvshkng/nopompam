'use server'

import { signIn} from "@/auth";

export async function login() {
    await signIn("google", { redirect: true, redirectTo: "/chat" });
}