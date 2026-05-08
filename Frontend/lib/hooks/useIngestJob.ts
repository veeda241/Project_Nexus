"use client";
import { useQuery } from "@tanstack/react-query";
import { getJob } from "../api/ingest";

const TERMINAL = new Set(["complete", "failed"]);

export function useIngestJob(jobId: string | null) {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status && TERMINAL.has(status) ? false : 2000;
    },
  });
}
