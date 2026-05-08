import { apiClient } from "./client";
import type { GraphData, GraphStats } from "../types/api";

export async function getGraph(kbId: string): Promise<GraphData> {
  const res = await apiClient.get<GraphData>(`/graph/${kbId}`);
  return res.data;
}

export async function getChain(chunkId: string): Promise<GraphData> {
  const res = await apiClient.get<any>(`/graph/chain/${chunkId}`);
  const data = res.data;
  return {
    nodes: data.nodes ?? [],
    links: data.edges ?? data.links ?? [],
  };
}

export async function getGraphStats(kbId: string): Promise<GraphStats> {
  const res = await apiClient.get<GraphStats>(`/graph/${kbId}/stats`);
  return res.data;
}
