"use client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useIngestJob } from "@/lib/hooks/useIngestJob";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface ActiveJob {
  jobId: string;
  filename: string;
}

export function JobProgressList({ jobs }: { jobs: ActiveJob[] }) {
  if (!jobs.length) return null;

  return (
    <div className="space-y-2">
      {jobs.map((j) => (
        <JobRow key={j.jobId} jobId={j.jobId} filename={j.filename} />
      ))}
    </div>
  );
}

function JobRow({ jobId, filename }: { jobId: string; filename: string }) {
  const { data: job } = useIngestJob(jobId);
  const progress = job?.progress_pct ?? 0;
  const status = job?.status ?? "queued";

  return (
    <div className="glass rounded-lg px-4 py-3 flex items-center gap-3">
      <div className="shrink-0">
        {status === "complete" ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : status === "failed" ? (
          <XCircle className="h-4 w-4 text-red-400" />
        ) : (
          <Loader2 className="h-4 w-4 text-violet-400 animate-spin" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-white/80 truncate">{filename}</p>
          <Badge
            variant={
              status === "complete"
                ? "success"
                : status === "failed"
                ? "error"
                : status === "processing"
                ? "info"
                : "default"
            }
          >
            {status === "queued"
              ? "Queued"
              : status === "processing"
              ? `${progress}%`
              : status === "complete"
              ? "Done"
              : "Error"}
          </Badge>
        </div>
        {status !== "complete" && status !== "failed" && (
          <Progress value={progress} className="h-1" />
        )}
        {status === "failed" && job?.error_message && (
          <p className="text-xs text-red-400 mt-0.5">{job.error_message}</p>
        )}
      </div>
    </div>
  );
}
