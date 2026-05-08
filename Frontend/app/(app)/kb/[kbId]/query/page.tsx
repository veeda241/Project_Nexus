"use client";
import { use, useState } from "react";
import { QueryBox } from "@/components/query/QueryBox";
import { AnswerCard } from "@/components/query/AnswerCard";
import { ChunkList } from "@/components/query/ChunkList";
import { useQueryAsk } from "@/lib/hooks/useQueryAsk";
import { useQuery } from "@tanstack/react-query";
import { getQueryHistory } from "@/lib/api/query";
import type { QueryRequest, QueryResponse, GraphData } from "@/lib/types/api";
import { Clock, GitBranch, X } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface Props {
  params: Promise<{ kbId: string }>;
}

export default function QueryPage({ params }: Props) {
  const { kbId } = use(params);
  const { mutate, data: result, isPending, reset } = useQueryAsk();
  const [chainData, setChainData] = useState<GraphData | null>(null);

  const { data: history } = useQuery({
    queryKey: ["query-history", kbId],
    queryFn: () => getQueryHistory(kbId),
  });

  const handleSubmit = (req: QueryRequest) => {
    reset();
    setChainData(null);
    mutate(req);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* History sidebar */}
      {history && history.length > 0 && (
        <div className="w-56 shrink-0 border-r border-white/6 overflow-y-auto p-3 space-y-1">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-2">
            History
          </p>
          {history.map((session) => (
            <button
              key={session.id}
              className="w-full text-left px-3 py-2 rounded-lg text-xs text-white/50 hover:bg-white/5 hover:text-white/80 transition-all"
            >
              <p className="truncate">{session.query_text}</p>
              <p className="text-[10px] text-white/25 mt-0.5 flex items-center gap-1">
                <Clock className="h-2.5 w-2.5" />
                {formatDate(session.created_at)}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <QueryBox kbId={kbId} onSubmit={handleSubmit} isLoading={isPending} />

        {isPending && (
          <div className="flex items-center gap-3 text-sm text-white/40">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
            Searching knowledge base…
          </div>
        )}

        {result && <QueryResult result={result} onShowChain={setChainData} />}

        {chainData && (
          <div className="glass rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/70 flex items-center gap-1.5">
                <GitBranch className="h-4 w-4 text-cyan-400" />
                Evidence chain ({chainData.nodes.length} nodes)
              </h3>
              <button
                onClick={() => setChainData(null)}
                className="p-1 text-white/30 hover:text-white/70 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {chainData.nodes.map((node) => (
                <div key={node.id} className="flex items-start gap-2 text-sm">
                  <span className="font-mono text-xs text-white/25 shrink-0 pt-0.5">
                    {node.modality}
                  </span>
                  <p className="text-white/60 line-clamp-2">{String(node.text_preview ?? "")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QueryResult({
  result,
  onShowChain,
}: {
  result: QueryResponse;
  onShowChain: (d: GraphData) => void;
}) {
  return (
    <div className="space-y-4">
      {result.answer && (
        <div>
          <h3 className="text-xs font-medium uppercase tracking-wider text-white/35 mb-2">Answer</h3>
          <AnswerCard
            answer={result.answer.annotated_text || result.answer.text}
            citations={result.answer.citations}
            confidenceScore={result.answer.confidence_score}
            insufficientEvidence={result.answer.insufficient_evidence}
            onShowChain={onShowChain}
          />
          {result.answer.llm_provider && (
            <p className="mt-1.5 text-right text-[10px] text-white/20 font-mono">
              via {result.answer.llm_provider}
            </p>
          )}
        </div>
      )}

      {result.results.length > 0 && (
        <ChunkList chunks={result.results} />
      )}
    </div>
  );
}
