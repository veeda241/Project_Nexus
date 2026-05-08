"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("nexus_token");
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);
  return <div className="h-screen bg-[#0a0a0f]" />;
}
