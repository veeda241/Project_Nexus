"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listKBs, createKB } from "../api/kb";
import type { CreateKBRequest } from "../types/api";

export function useKBs() {
  return useQuery({ queryKey: ["kbs"], queryFn: listKBs });
}

export function useCreateKB() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKBRequest) => createKB(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kbs"] }),
  });
}
