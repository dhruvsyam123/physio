import { create } from "zustand";
import type { OutcomeRecord } from "@/types/outcomes";
import { mockOutcomes } from "@/data/outcomes";

interface OutcomeStore {
  outcomes: OutcomeRecord[];
  addOutcome: (record: OutcomeRecord) => void;
  getOutcomesByPatient: (patientId: string) => OutcomeRecord[];
  getLatestByType: (
    patientId: string,
    type: string,
    label?: string
  ) => OutcomeRecord | undefined;
  getOutcomeHistory: (
    patientId: string,
    type: string,
    label?: string
  ) => OutcomeRecord[];
}

export const useOutcomeStore = create<OutcomeStore>((set, get) => ({
  outcomes: mockOutcomes,

  addOutcome: (record) =>
    set((state) => ({
      outcomes: [...state.outcomes, record],
    })),

  getOutcomesByPatient: (patientId) =>
    get().outcomes.filter((o) => o.patientId === patientId),

  getLatestByType: (patientId, type, label) => {
    const filtered = get().outcomes.filter(
      (o) =>
        o.patientId === patientId &&
        o.type === type &&
        (label ? o.label === label : true)
    );
    if (filtered.length === 0) return undefined;
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0];
  },

  getOutcomeHistory: (patientId, type, label) => {
    return get()
      .outcomes.filter(
        (o) =>
          o.patientId === patientId &&
          o.type === type &&
          (label ? o.label === label : true)
      )
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
  },
}));
