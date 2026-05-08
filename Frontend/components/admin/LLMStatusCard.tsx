import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { LLMStatus } from "@/lib/types/api";

export function LLMStatusCard({ status, isLoading }: { status?: LLMStatus; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-white/40 text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Checking providers…
      </div>
    );
  }

  if (!status) return null;

  const providers = status.providers ?? [];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {providers.map((p) => (
        <div key={p.provider} className="glass rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white/80 capitalize">{p.provider}</span>
            {p.available ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400" />
            )}
          </div>
          <p className={`text-xs ${p.available ? "text-emerald-400" : "text-red-400"}`}>
            {p.available ? "Reachable" : "Unreachable"}
          </p>
          {!p.configured && <p className="text-[10px] text-white/25 font-mono mt-1">not configured</p>}
        </div>
      ))}
    </div>
  );
}
