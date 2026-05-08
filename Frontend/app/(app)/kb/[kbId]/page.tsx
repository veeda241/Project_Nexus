"use client";
import { use, useState, useEffect } from "react";
import { toast } from "sonner";
import { Dropzone } from "@/components/ingest/Dropzone";
import { JobProgressList } from "@/components/ingest/JobProgressList";
import { DocumentTable } from "@/components/ingest/DocumentTable";
import { uploadFile, getDocuments } from "@/lib/api/ingest";
import { extractErrorMessage } from "@/lib/utils/errors";
import type { Document } from "@/lib/types/api";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  params: Promise<{ kbId: string }>;
}

interface ActiveJob {
  jobId: string;
  filename: string;
}

export default function DocumentsPage({ params }: Props) {
  const { kbId } = use(params);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    getDocuments(kbId)
      .then(setDocuments)
      .catch(() => {});
  }, [kbId]);

  const handleFiles = async (files: File[]) => {
    setUploading(true);
    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const res = await uploadFile(kbId, file);
          return { jobId: res.job_id, filename: file.name, docId: res.document_id };
        })
      );
      setActiveJobs((prev) => [
        ...prev,
        ...results.map((r) => ({ jobId: r.jobId, filename: r.filename })),
      ]);
      toast.success(`${files.length} file${files.length > 1 ? "s" : ""} queued for ingestion`);
      // Refresh documents after short delay
      setTimeout(() => {
        getDocuments(kbId).then(setDocuments).catch(() => {});
        qc.invalidateQueries({ queryKey: ["kbs"] });
      }, 3000);
    } catch (e: unknown) {
      toast.error(extractErrorMessage(e, "Upload failed"));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleted = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  return (
    <div className="p-6 space-y-6">
      <Dropzone onFiles={handleFiles} disabled={uploading} />

      {activeJobs.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/50 mb-3">Ingestion progress</h3>
          <JobProgressList jobs={activeJobs} />
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-white/50 mb-3">Documents</h3>
        <DocumentTable documents={documents} onDeleted={handleDeleted} />
      </div>
    </div>
  );
}
