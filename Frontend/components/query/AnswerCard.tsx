"use client";
import { ConfidenceBadge } from "./ConfidenceBadge";
import { AlertTriangle, GitBranch } from "lucide-react";
import type { AnswerCitation, GraphData } from "@/lib/types/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { getChain } from "@/lib/api/graph";

interface Props {
  answer: string; // annotated_text (contains [1], [2] numeric labels)
  citations: AnswerCitation[];
  confidenceScore?: number;
  insufficientEvidence?: boolean;
  onShowChain?: (data: GraphData) => void;
}

type Token =
  | { type: "text"; content: string }
  | { type: "citation"; label: string; citation: AnswerCitation };

function parseAnnotatedText(text: string, citations: AnswerCitation[]): Token[] {
  const citMap = Object.fromEntries(citations.map((c) => [c.citation_label, c]));
  const parts = text.split(/(\[\d+\])/g);
  const tokens: Token[] = [];
  for (const part of parts) {
    if (!part) continue;
    const match = part.match(/^(\[\d+\])$/);
    if (match && citMap[match[1]]) {
      tokens.push({ type: "citation", label: match[1], citation: citMap[match[1]] });
    } else {
      tokens.push({ type: "text", content: part });
    }
  }
  return tokens;
}

function CitationChip({
  label,
  citation,
  index,
  onShowChain,
}: {
  label: string;
  citation: AnswerCitation;
  index: number;
  onShowChain?: (data: GraphData) => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleChain = async () => {
    setLoading(true);
    try {
      const data = await getChain(citation.chunk_id);
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
          className="z-50 w-72 glass rounded-xl p-4 shadow-2xl"
          sideOffset={5}
        >
          <p className="text-xs font-medium text-white/40 mb-2 uppercase tracking-wider">Source</p>
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
          <Popover.Arrow className="fill-white/10" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function AnswerCard({
  answer,
  citations,
  confidenceScore,
  insufficientEvidence,
  onShowChain,
}: Props) {
  const tokens = parseAnnotatedText(answer, citations ?? []);

  return (
    <div className="glass rounded-xl p-5">
      {insufficientEvidence && (
        <div className="flex items-center gap-2 text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-lg px-3 py-2 mb-4 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          Insufficient evidence in the knowledge base to fully answer this question.
        </div>
      )}

      {confidenceScore !== undefined && (
        <div className="mb-3">
          <ConfidenceBadge score={confidenceScore} />
        </div>
      )}

      <div className="prose prose-sm prose-invert max-w-none">
        {tokens.map((token, i) => {
          if (token.type === "text") {
            return (
              <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
                {token.content}
              </ReactMarkdown>
            );
          }
          const idx = citations.findIndex((c) => c.citation_label === token.label) + 1;
          return (
            <CitationChip
              key={i}
              label={token.label}
              citation={token.citation}
              index={idx}
              onShowChain={onShowChain}
            />
          );
        })}
      </div>
    </div>
  );
}
