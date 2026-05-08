"use client";
import { useState } from "react";
import { Send, Settings2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import type { ModalityFilter, QueryRequest } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface Props {
  kbId: string;
  onSubmit: (req: QueryRequest) => void;
  isLoading: boolean;
}

export function QueryBox({ kbId, onSubmit, isLoading }: Props) {
  const [query, setQuery] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [topK, setTopK] = useState(10);
  const [modalityFilter, setModalityFilter] = useState<ModalityFilter>("all");
  const [expandChains, setExpandChains] = useState(true);
  const [generateAnswer, setGenerateAnswer] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit({
      kb_id: kbId,
      query: query.trim(),
      top_k: topK,
      modality_filter: modalityFilter,
      expand_evidence_chains: expandChains,
      generate_answer: generateAnswer,
    });
  };

  return (
    <div className="glass rounded-xl p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about your documents…"
          className="flex-1 h-12 text-base"
          disabled={isLoading}
        />
        <Button type="submit" size="lg" disabled={isLoading || !query.trim()} className="h-12 px-5">
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-12 px-3"
          onClick={() => setShowOptions((s) => !s)}
        >
          <Settings2 className="h-4 w-4" />
          <ChevronDown className={cn("h-3 w-3 transition-transform", showOptions && "rotate-180")} />
        </Button>
      </form>

      {showOptions && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/8">
          {/* top_k */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/40">Top-K results</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={1}
                max={20}
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="flex-1 accent-violet-500"
              />
              <span className="text-xs font-mono text-white/60 w-5">{topK}</span>
            </div>
          </div>

          {/* modality filter */}
          <div className="space-y-1.5">
            <label className="text-xs text-white/40">Modality</label>
            <Select
              value={modalityFilter}
              onValueChange={(v) => setModalityFilter(v as ModalityFilter)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="text">Text only</SelectItem>
                <SelectItem value="image">Image only</SelectItem>
                <SelectItem value="audio">Audio only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* expand chains */}
          <div className="flex items-center gap-2 mt-auto">
            <input
              type="checkbox"
              id="expand"
              checked={expandChains}
              onChange={(e) => setExpandChains(e.target.checked)}
              className="accent-violet-500 h-4 w-4"
            />
            <label htmlFor="expand" className="text-xs text-white/60 cursor-pointer">
              Evidence chains
            </label>
          </div>

          {/* generate answer */}
          <div className="flex items-center gap-2 mt-auto">
            <input
              type="checkbox"
              id="generate"
              checked={generateAnswer}
              onChange={(e) => setGenerateAnswer(e.target.checked)}
              className="accent-violet-500 h-4 w-4"
            />
            <label htmlFor="generate" className="text-xs text-white/60 cursor-pointer">
              Generate answer
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
