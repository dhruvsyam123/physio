"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SOAPNote } from "@/types";

export function useNotes(patientId?: string) {
  return useQuery({
    queryKey: ["notes", patientId],
    queryFn: () => api.notes.list(patientId),
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ["notes", "detail", id],
    queryFn: () => api.notes.get(id),
    enabled: !!id,
  });
}

export function useNotesByPatient(patientId: string) {
  return useQuery({
    queryKey: ["notes", patientId],
    queryFn: () => api.notes.list(patientId),
    enabled: !!patientId,
  });
}

export function useCreateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.notes.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useUpdateNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SOAPNote> }) =>
      api.notes.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}
