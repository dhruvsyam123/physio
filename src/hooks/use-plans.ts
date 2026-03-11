"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { TreatmentPlan } from "@/types";

export function usePlans(patientId?: string) {
  return useQuery({
    queryKey: ["plans", patientId],
    queryFn: () => api.plans.list(patientId),
  });
}

export function usePlansByPatient(patientId: string) {
  return useQuery({
    queryKey: ["plans", patientId],
    queryFn: () => api.plans.list(patientId),
    enabled: !!patientId,
  });
}

export function usePlan(id: string) {
  return useQuery({
    queryKey: ["plans", "detail", id],
    queryFn: () => api.plans.get(id),
    enabled: !!id,
  });
}

export function useCreatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.plans.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function useUpdatePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TreatmentPlan> }) =>
      api.plans.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}

export function useDeletePlan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.plans.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["plans"] });
    },
  });
}
