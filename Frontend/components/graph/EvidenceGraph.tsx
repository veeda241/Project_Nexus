"use client";
import { useRef, useCallback, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { ForceGraphMethods } from "react-force-graph-2d";
import type { GraphData, GraphNode, GraphEdge, Modality, LinkType } from "@/lib/types/api";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

const MODALITY_COLOR: Record<Modality, string> = {
  text: "#3b82f6",
  image: "#8b5cf6",
  audio: "#10b981",
};

const LINK_COLOR: Record<LinkType, string> = {
  semantic: "#06b6d4",
  entity: "#f59e0b",
  temporal: "#ec4899",
};

interface FilterState {
  modalities: Set<Modality>;
  linkTypes: Set<LinkType>;
}

interface Props {
  data: GraphData;
  onNodeClick?: (node: GraphNode) => void;
}

export function EvidenceGraph({ data, onNodeClick }: Props) {
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [filters, setFilters] = useState<FilterState>({
    modalities: new Set(["text", "image", "audio"]),
    linkTypes: new Set(["semantic", "entity", "temporal"]),
  });
  const [hovered, setHovered] = useState<string | null>(null);

  const filteredData = useMemo(() => ({
    nodes: data.nodes.filter((n) => filters.modalities.has(n.modality as Modality)),
    links: data.links.filter(
      (l) =>
        filters.linkTypes.has(l.link_type as LinkType) &&
        filters.modalities.has(
          data.nodes.find((n) => n.id === l.source)?.modality as Modality
        ) &&
        filters.modalities.has(
          data.nodes.find((n) => n.id === l.target)?.modality as Modality
        )
    ),
  }), [data, filters]);

  const nodeColor = useCallback(
    (node: GraphNode) => {
      const m = node.modality as Modality;
      const base = MODALITY_COLOR[m] ?? "#888";
      if (hovered === node.id) return "#ffffff";
      // Dim non-neighbours when hovering
      if (hovered) {
        const isNeighbour = data.links.some(
          (l) =>
            (l.source === hovered && l.target === node.id) ||
            (l.target === hovered && l.source === node.id)
        );
        return isNeighbour ? base : `${base}33`;
      }
      return base;
    },
    [hovered, data.links]
  );

  const linkColor = useCallback(
    (link: GraphEdge) => {
      const base = LINK_COLOR[link.link_type as LinkType] ?? "#666";
      if (!hovered) return `${base}80`;
      const src = typeof link.source === "object" ? (link.source as GraphNode).id : link.source;
      const tgt = typeof link.target === "object" ? (link.target as GraphNode).id : link.target;
      return src === hovered || tgt === hovered ? base : `${base}20`;
    },
    [hovered]
  );

  const toggleModality = (m: Modality) => {
    setFilters((prev) => {
      const next = new Set(prev.modalities);
      next.has(m) ? next.delete(m) : next.add(m);
      return { ...prev, modalities: next };
    });
  };

  const toggleLink = (t: LinkType) => {
    setFilters((prev) => {
      const next = new Set(prev.linkTypes);
      next.has(t) ? next.delete(t) : next.add(t);
      return { ...prev, linkTypes: next };
    });
  };

  return (
    <div className="relative w-full h-full">
      <ForceGraph2D
        ref={graphRef}
        graphData={filteredData as unknown as { nodes: object[]; links: object[] }}
        backgroundColor="#0a0a0f"
        nodeColor={(n) => nodeColor(n as GraphNode)}
        nodeRelSize={5}
        nodeLabel={(n) => {
          const node = n as GraphNode;
          return `${node.modality}: ${String(node.text_preview ?? "").slice(0, 60)}…`;
        }}
        linkColor={(l) => linkColor(l as GraphEdge)}
        linkWidth={1.5}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={1.5}
        linkDirectionalParticleColor={(l) => linkColor(l as GraphEdge)}
        onNodeClick={(n) => onNodeClick?.(n as GraphNode)}
        onNodeHover={(n) => setHovered(n ? (n as GraphNode).id : null)}
        cooldownTicks={80}
        d3AlphaDecay={0.02}
        d3VelocityDecay={0.3}
        warmupTicks={50}
      />

      {/* Legend overlay */}
      <div className="absolute top-4 left-4 glass rounded-xl p-3 space-y-3 text-xs">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Modality</p>
          <div className="space-y-1">
            {(["text", "image", "audio"] as Modality[]).map((m) => (
              <button
                key={m}
                onClick={() => toggleModality(m)}
                className={`flex items-center gap-2 w-full transition-opacity ${
                  filters.modalities.has(m) ? "opacity-100" : "opacity-30"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: MODALITY_COLOR[m] }}
                />
                <span className="text-white/70 capitalize">{m}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Links</p>
          <div className="space-y-1">
            {(["semantic", "entity", "temporal"] as LinkType[]).map((t) => (
              <button
                key={t}
                onClick={() => toggleLink(t)}
                className={`flex items-center gap-2 w-full transition-opacity ${
                  filters.linkTypes.has(t) ? "opacity-100" : "opacity-30"
                }`}
              >
                <span className="h-0.5 w-5 rounded" style={{ background: LINK_COLOR[t] }} />
                <span className="text-white/70 capitalize">{t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
