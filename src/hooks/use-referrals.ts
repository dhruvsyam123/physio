"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Referral } from "@/types";

export function useReferrals() {
  return useQuery({
    queryKey: ["referrals"],
    queryFn: api.referrals.list,
  });
}

export function useReferral(id: string) {
  return useQuery({
    queryKey: ["referrals", id],
    queryFn: () => api.referrals.get(id),
    enabled: !!id,
  });
}

export function useCreateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.referrals.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
}

export function useUpdateReferral() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Referral> }) =>
      api.referrals.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["referrals"] });
    },
  });
}
