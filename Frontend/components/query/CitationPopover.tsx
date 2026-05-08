"use client";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { GitBranch } from "lucide-react";
import { getChain } from "@/lib/api/graph";
import type { AnswerCitation, GraphData } from "@/lib/types/api";

interface Props {
  chunkId: string;
  index: number;
  citation?: AnswerCitation;
  onShowChain?: (data: GraphData) => void;
}

export function CitationPopover({ chunkId, index, citation, onShowChain }: Props) {
  const [loading, setLoading] = useState(false);

  const handleChain = async () => {
    setLoading(true);
    try {
      const data = await getChain(chunkId);
      onShowChain?.(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded text-[10px] font-bold bg-violet-500/25 text-violet-300 border border-violet-500/40 hover:bg-violet-500/40 transition-colors cursor-pointer align-middle mx-0.5">
          {index}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          className="z-50 w-80 glass rounded-xl p-4 shadow-2xl"
          sideOffset={5}
        >
          <p className="text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Source</p>
          {citation ? (
            <>
              <p className="text-sm text-white/80 font-medium truncate">{citation.filename}</p>
              <div className="mt-1 text-xs text-white/35 font-mono space-x-2">
                {citation.page_number && <span>p{citation.page_number}</span>}
                {citation.timestamp_start != null && (
                  <span>{Math.floor(citation.timestamp_start)}s</span>
                )}
                <span className="capitalize text-white/25">{citation.modality}</span>
              </div>
              {onShowChain && (
                <button
                  onClick={handleChain}
                  disabled={loading}
                  className="mt-3 flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <GitBranch className="h-3 w-3" />
                  {loading ? "Loading…" : "Show chain"}
                </button>
              )}
            </>
          ) : (
            <p className="text-xs text-white/30 font-mono">{chunkId}</p>
          )}
          <Popover.Arrow className="fill-white/10" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
