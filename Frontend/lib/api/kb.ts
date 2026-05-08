import { apiClient } from "./client";
import type { KnowledgeBase, CreateKBRequest } from "../types/api";

export async function listKBs(): Promise<KnowledgeBase[]> {
  const res = await apiClient.get<KnowledgeBase[]>("/kb/");
  return res.data;
}

export async function createKB(data: CreateKBRequest): Promise<KnowledgeBase> {
  const res = await apiClient.post<KnowledgeBase>("/kb/", data);
  return res.data;
}
