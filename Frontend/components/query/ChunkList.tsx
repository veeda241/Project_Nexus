import { Badge } from "@/components/ui/badge";
import type { QueryResult, Modality } from "@/lib/types/api";
import { formatDuration } from "@/lib/utils/format";

export function ChunkList({ chunks }: { chunks: QueryResult[] }) {
  if (!chunks.length) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-medium uppercase tracking-wider text-white/35">
        Retrieved chunks ({chunks.length})
      </h3>
      {chunks.map((chunk, i) => (
        <ChunkCard key={chunk.chunk_id} chunk={chunk} index={i + 1} />
      ))}
    </div>
  );
}

function ChunkCard({ chunk, index }: { chunk: QueryResult; index: number }) {
  const score = chunk.score ?? 0;
  const modalityMap: Record<Modality, string> = {
    text: "text",
    image: "image",
    audio: "audio",
  };

  return (
    <div className="glass rounded-lg p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-white/25">#{index}</span>
          <Badge variant={modalityMap[chunk.modality] as "text" | "image" | "audio"}>
            {chunk.modality}
          </Badge>
          {chunk.filename && (
            <span className="text-xs text-white/35 truncate max-w-[150px]">
              {chunk.filename}
            </span>
          )}
          {chunk.page_number && (
            <span className="text-xs text-white/25">p{chunk.page_number}</span>
          )}
          {chunk.timestamp_start != null && (
            <span className="text-xs text-white/25 font-mono">
              {formatDuration(chunk.timestamp_start)}
            </span>
          )}
        </div>
        {/* Similarity bar */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-1.5 w-16 rounded-full bg-white/8 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all"
              style={{ width: `${Math.round(score * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-white/30">{Math.round(score * 100)}%</span>
        </div>
      </div>
      <p className="text-sm text-white/65 line-clamp-3">{chunk.text}</p>
    </div>
  );
}
