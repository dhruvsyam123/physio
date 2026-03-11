"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { OutcomeRecord } from "@/types/outcomes";

export function useOutcomes(params?: { patientId?: string; type?: string }) {
  return useQuery({
    queryKey: ["outcomes", params],
    queryFn: () => api.outcomes.list(params),
  });
}

export function useOutcomesByPatient(patientId: string) {
  return useQuery({
    queryKey: ["outcomes", { patientId }],
    queryFn: () => api.outcomes.list({ patientId }),
    enabled: !!patientId,
  });
}

export function useCreateOutcome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.outcomes.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["outcomes"] });
    },
  });
}

export function useDeleteOutcome() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.outcomes.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["outcomes"] });
    },
  });
}

// Helper hooks that mirror the old store's filtering logic
export function useLatestOutcomeByType(
  patientId: string,
  type: string,
  label?: string
) {
  const { data: outcomes = [] } = useOutcomesByPatient(patientId);
  const filtered = outcomes.filter(
    (o: OutcomeRecord) => o.type === type && (label ? o.label === label : true)
  );
  if (filtered.length === 0) return undefined;
  return [...filtered].sort(
    (a: OutcomeRecord, b: OutcomeRecord) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
}

export function useOutcomeHistory(
  patientId: string,
  type: string,
  label?: string
) {
  const { data: outcomes = [] } = useOutcomesByPatient(patientId);
  return outcomes
    .filter(
      (o: OutcomeRecord) =>
        o.type === type && (label ? o.label === label : true)
    )
    .sort(
      (a: OutcomeRecord, b: OutcomeRecord) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
}
