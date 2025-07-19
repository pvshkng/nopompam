import type { Metadata } from "next";
import { Noto_Serif } from "next/font/google";
import type { Viewport } from "next";
//import AuthProvider from "@/components/AuthProvider";
import { cn } from "@/lib/utils";
import "./globals.css";
//import { Toaster } from "@/components/ui/sonner";

const noto_serif = Noto_Serif({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nopompam",
  description: "chat.ai",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("size-full")}>
      {/* <AuthProvider> */}
      <body className={cn(noto_serif.className, "size-full bg-neutral-100")}>{children}</body>
      {/*  <Toaster richColors theme="light" closeButton/> */}
      {/* </AuthProvider> */}
    </html>
  );
}
