"use client";
import Link from "next/link";
import { Database, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { KnowledgeBase } from "@/lib/types/api";

export function KBCard({ kb }: { kb: KnowledgeBase }) {
  return (
    <Link
      href={`/kb/${kb.id}`}
      className="group glass rounded-xl p-5 flex flex-col gap-3 hover:bg-white/6 transition-all duration-200 hover:glow-border"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
          <Database className="h-5 w-5" />
        </div>
        <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
      </div>
      <div>
        <h3 className="font-semibold text-white group-hover:text-white transition-colors">{kb.name}</h3>
        {kb.description && (
          <p className="mt-1 text-sm text-white/40 line-clamp-2">{kb.description}</p>
        )}
      </div>
      <p className="text-xs text-white/25 mt-auto">{formatDate(kb.created_at)}</p>
    </Link>
  );
}
