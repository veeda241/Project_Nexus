import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "NEXUS — Multimodal RAG",
  description: "Private multimodal search engine with AI-generated answers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full dark`} suppressHydrationWarning>
      <body className="h-full bg-[#0a0a0f] text-[#e8e8f0] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
