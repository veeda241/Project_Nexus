import { apiClient } from "./client";
import type { UploadResponse, IngestionJob, Document, Transcript } from "../types/api";

export async function uploadFile(
  kbId: string,
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadResponse> {
  const form = new FormData();
  form.append("file", file);
  // kb_id is a query param on the backend (Query(...)), not a form field
  const res = await apiClient.post<UploadResponse>(`/ingest/file?kb_id=${encodeURIComponent(kbId)}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    },
  });
  return res.data;
}

export async function getJob(jobId: string): Promise<IngestionJob> {
  const res = await apiClient.get<IngestionJob>(`/ingest/jobs/${jobId}`);
  return res.data;
}

export async function getDocuments(kbId: string): Promise<Document[]> {
  const res = await apiClient.get<Document[]>(`/ingest/documents`, {
    params: { kb_id: kbId },
  });
  return res.data;
}

export async function deleteDocument(docId: string): Promise<void> {
  await apiClient.delete(`/ingest/${docId}`);
}

export async function getTranscript(docId: string): Promise<Transcript> {
  const res = await apiClient.get<Transcript>(`/ingest/${docId}/transcript`);
  return res.data;
}
