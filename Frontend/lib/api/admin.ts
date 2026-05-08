import { apiClient } from "./client";
import type { AdminUser, UsageStats, UserRole } from "../types/api";

export async function listUsers(): Promise<AdminUser[]> {
  const res = await apiClient.get<any[]>("/admin/users");
  return res.data.map((u: any) => ({ ...u, id: u.user_id }));
}

export async function setUserRole(userId: string, role: UserRole): Promise<void> {
  await apiClient.patch(`/admin/users/${userId}/role`, { role });
}

export async function deactivateUser(userId: string): Promise<void> {
  await apiClient.patch(`/admin/users/${userId}/deactivate`);
}

export async function getUsageStats(): Promise<UsageStats> {
  const res = await apiClient.get<UsageStats>("/admin/usage");
  return res.data;
}
