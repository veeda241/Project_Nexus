import { apiClient } from "./client";
import type { LLMStatus, ProviderStatus } from "../types/api";

export async function getLLMStatus(): Promise<LLMStatus> {
  const res = await apiClient.get<any>("/llm/status");
  const raw = res.data;
  const providers: ProviderStatus[] = Object.entries(raw.providers ?? {}).map(
    ([name, cfg]: [string, any]) => ({
      provider: name,
      available: cfg.status === "ok",
      configured: cfg.configured ?? false,
      status: cfg.status ?? "not_tested",
    })
  );
  return { ...raw, providers };
}
