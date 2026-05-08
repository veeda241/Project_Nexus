"use client";
import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getGraph, getGraphStats } from "@/lib/api/graph";
import { EvidenceGraph } from "@/components/graph/EvidenceGraph";
import type { GraphNode } from "@/lib/types/api";
import { X } from "lucide-react";

interface Props {
  params: Promise<{ kbId: string }>;
}

export default function GraphPage({ params }: Props) {
  const { kbId } = use(params);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const { data: graphData, isLoading } = useQuery({
    queryKey: ["graph", kbId],
    queryFn: () => getGraph(kbId),
  });

  const { data: stats } = useQuery({
    queryKey: ["graph-stats", kbId],
    queryFn: () => getGraphStats(kbId),
  });

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!graphData || graphData.nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <p className="text-lg font-medium text-white/50">No graph data yet</p>
          <p className="text-sm text-white/30 mt-1">
            Upload and ingest documents to build the evidence graph.
          </p>
        </div>
      </div>
    );
  }

  const avgDegree =
    stats && stats.total_nodes > 0
      ? ((2 * stats.total_edges) / stats.total_nodes).toFixed(1)
      : "—";

  return (
    <div className="relative h-full w-full">
      <EvidenceGraph data={graphData} onNodeClick={setSelectedNode} />

      {/* Stats overlay */}
      {stats && (
        <div className="absolute top-4 right-4 glass rounded-xl p-3 text-xs space-y-1 min-w-32">
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Stats</p>
          <div className="flex justify-between gap-4">
            <span className="text-white/40">Nodes</span>
            <span className="font-mono text-white/70">{stats.total_nodes}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/40">Edges</span>
            <span className="font-mono text-white/70">{stats.total_edges}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-white/40">Avg degree</span>
            <span className="font-mono text-white/70">{avgDegree}</span>
          </div>
        </div>
      )}

      {/* Node detail drawer */}
      {selectedNode && (
        <div className="absolute bottom-0 right-0 top-0 w-72 glass border-l border-white/8 p-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/80">Chunk detail</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 text-white/30 hover:text-white/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Modality</p>
              <p className="text-white/70 capitalize">{selectedNode.modality}</p>
            </div>
            {selectedNode.text_preview && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Content</p>
                <p className="text-white/65 text-xs leading-relaxed">
                  {String(selectedNode.text_preview)}
                </p>
              </div>
            )}
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Chunk ID</p>
              <p className="font-mono text-[10px] text-white/30 break-all">{selectedNode.id}</p>
            </div>
            {selectedNode.page_number && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Page</p>
                <p className="text-white/70">{String(selectedNode.page_number)}</p>
              </div>
            )}
            {selectedNode.timestamp_start != null && (
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Timestamp</p>
                <p className="font-mono text-white/70">{String(selectedNode.timestamp_start)}s</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
