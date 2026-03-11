import { create } from 'zustand';
import type { TreatmentPlan } from '@/types';
import { mockPlans } from '@/data/plans';

interface PlanStore {
  plans: TreatmentPlan[];
  addPlan: (plan: TreatmentPlan) => void;
  updatePlan: (id: string, updates: Partial<TreatmentPlan>) => void;
  getPlansByPatient: (patientId: string) => TreatmentPlan[];
}

export const usePlanStore = create<PlanStore>((set, get) => ({
  plans: mockPlans,

  addPlan: (plan) =>
    set((state) => ({
      plans: [...state.plans, plan],
    })),

  updatePlan: (id, updates) =>
    set((state) => ({
      plans: state.plans.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  getPlansByPatient: (patientId) =>
    get().plans.filter((p) => p.patientId === patientId),
}));
