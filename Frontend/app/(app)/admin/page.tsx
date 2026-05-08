"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listUsers, getUsageStats } from "@/lib/api/admin";
import { getLLMStatus } from "@/lib/api/llm";
import { UserTable } from "@/components/admin/UserTable";
import { UsageStatsPanel } from "@/components/admin/UsageStats";
import { LLMStatusCard } from "@/components/admin/LLMStatusCard";
import { Topbar } from "@/components/shell/Topbar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/stores/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield } from "lucide-react";

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: listUsers,
    enabled: user?.role === "admin",
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-usage"],
    queryFn: getUsageStats,
    enabled: user?.role === "admin",
  });

  const { data: llmStatus, isLoading: llmLoading } = useQuery({
    queryKey: ["llm-status"],
    queryFn: getLLMStatus,
    enabled: user?.role === "admin",
    staleTime: 30_000,
  });

  if (!user || user.role !== "admin") {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <Shield className="h-10 w-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Topbar title="Admin" />
      <div className="p-6">
        <Tabs defaultValue="users">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="llm">LLM Status</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            {usersLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 glass rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <UserTable
                users={users ?? []}
                onUpdated={() => qc.invalidateQueries({ queryKey: ["admin-users"] })}
              />
            )}
          </TabsContent>

          <TabsContent value="usage">
            {statsLoading ? (
              <div className="grid grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-24 glass rounded-xl animate-pulse" />
                ))}
              </div>
            ) : stats ? (
              <UsageStatsPanel stats={stats} />
            ) : null}
          </TabsContent>

          <TabsContent value="llm">
            <LLMStatusCard status={llmStatus} isLoading={llmLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
