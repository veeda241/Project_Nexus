import { apiClient } from "./client";
import type { QueryRequest, QueryResponse, QuerySession } from "../types/api";

export async function ask(data: QueryRequest): Promise<QueryResponse> {
  const res = await apiClient.post<QueryResponse>("/query/", data);
  return res.data;
}

export async function getQueryHistory(kbId: string): Promise<QuerySession[]> {
  const res = await apiClient.get<any>("/query/history", {
    params: { kb_id: kbId },
  });
  const sessions = res.data?.sessions ?? [];
  return sessions.map((s: any) => ({ ...s, id: s.session_id }));
}
