"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useExercises(params?: {
  region?: string;
  category?: string;
  difficulty?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["exercises", params],
    queryFn: () => api.exercises.list(params),
  });
}
