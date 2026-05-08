"use client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ask } from "../api/query";
import { extractErrorMessage } from "../utils/errors";
import type { QueryRequest } from "../types/api";

export function useQueryAsk() {
  return useMutation({
    mutationFn: (req: QueryRequest) => ask(req),
    onError: (err) => {
      toast.error(extractErrorMessage(err, "Query failed"));
    },
  });
}
