import { cn } from "@/lib/utils";
import { formatConfidence } from "@/lib/utils/format";

export function ConfidenceBadge({ score }: { score: number }) {
  const color =
    score >= 0.7
      ? "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
      : score >= 0.4
      ? "text-amber-400 bg-amber-500/15 border-amber-500/30"
      : "text-red-400 bg-red-500/15 border-red-500/30";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        color
      )}
    >
      Confidence: {formatConfidence(score)}
    </span>
  );
}
