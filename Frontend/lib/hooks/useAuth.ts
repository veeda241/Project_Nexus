"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth";
import { getMe } from "../api/auth";

export function useAuth() {
  const { token, user, setUser, logout, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const { isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const u = await getMe();
      setUser(u);
      return u;
    },
    enabled: !!token,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return { token, user, isLoading, logout };
}
