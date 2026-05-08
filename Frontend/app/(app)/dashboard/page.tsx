"use client";
import { Topbar } from "@/components/shell/Topbar";
import { KBCard } from "@/components/kb/KBCard";
import { CreateKBDialog } from "@/components/kb/CreateKBDialog";
import { useKBs } from "@/lib/hooks/useKBs";
import { Database } from "lucide-react";

export default function DashboardPage() {
  const { data: kbs, isLoading } = useKBs();

  return (
    <>
      <Topbar title="Knowledge Bases" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Your Knowledge Bases</h1>
            <p className="text-sm text-white/40 mt-0.5">
              Upload documents and ask questions across them
            </p>
          </div>
          <CreateKBDialog />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass rounded-xl h-36 animate-pulse" />
            ))}
          </div>
        ) : kbs && kbs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kbs.map((kb) => (
              <KBCard key={kb.id} kb={kb} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 mb-4">
              <Database className="h-8 w-8" />
            </div>
            <h3 className="text-base font-medium text-white/70">No knowledge bases yet</h3>
            <p className="text-sm text-white/35 mt-1 mb-5 max-w-xs">
              Create your first knowledge base to start uploading documents and querying them with AI.
            </p>
            <CreateKBDialog />
          </div>
        )}
      </div>
    </>
  );
}
