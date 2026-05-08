export interface CitationToken {
  type: "text" | "citation";
  content: string;
  chunkId?: string;
}

export function parseCitations(text: string): CitationToken[] {
  const parts = text.split(/(\[SOURCE:\s*[^\]]+\])/g);
  return parts.map((part) => {
    const match = part.match(/\[SOURCE:\s*([^\]]+)\]/);
    if (match) {
      return { type: "citation", content: part, chunkId: match[1].trim() };
    }
    return { type: "text", content: part };
  });
}
