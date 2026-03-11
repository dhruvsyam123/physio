import { create } from 'zustand';
import type { Patient } from '@/types';
import { mockPatients } from '@/data/patients';

interface PatientStore {
  patients: Patient[];
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  getPatientById: (id: string) => Patient | undefined;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  patients: mockPatients,

  addPatient: (patient) =>
    set((state) => ({
      patients: [...state.patients, patient],
    })),

  updatePatient: (id, updates) =>
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  getPatientById: (id) => get().patients.find((p) => p.id === id),
}));
