import type { Metadata } from "next";
import { Inter } from "next/font/google";
//import AuthProvider from "@/components/AuthProvider";
import { cn } from "@/lib/utils";
import "./globals.css";
//import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "chat.ai",
  description: "chat.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("size-full")}>
      {/* <AuthProvider> */}
      <body className={cn(inter.className, "size-full")}>{children}</body>
      {/*  <Toaster richColors theme="light" closeButton/> */}
      {/* </AuthProvider> */}
    </html>
  );
}
