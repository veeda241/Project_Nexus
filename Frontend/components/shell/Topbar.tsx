"use client";
import { Bell } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth";

export function Topbar({ title }: { title?: string }) {
  const { user } = useAuthStore();

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/6 px-6">
      <h2 className="text-sm font-medium text-white/70">{title}</h2>
      <div className="flex items-center gap-3">
        <button className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition-all">
          <Bell className="h-4 w-4" />
        </button>
        <div className="h-7 w-px bg-white/8" />
        <span className="text-xs text-white/40">{user?.email}</span>
      </div>
    </header>
  );
}
