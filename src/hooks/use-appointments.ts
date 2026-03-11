"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Appointment } from "@/types";

export function useAppointments(params?: { date?: string; patientId?: string }) {
  return useQuery({
    queryKey: ["appointments", params],
    queryFn: () => api.appointments.list(params),
  });
}

export function useAppointmentsByDate(date: string) {
  return useAppointments({ date });
}

export function useAppointmentsByPatient(patientId: string) {
  return useQuery({
    queryKey: ["appointments", { patientId }],
    queryFn: () => api.appointments.list({ patientId }),
    enabled: !!patientId,
  });
}

export function useCreateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.appointments.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useUpdateAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) =>
      api.appointments.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useDeleteAppointment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.appointments.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
