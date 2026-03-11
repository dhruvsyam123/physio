import { create } from 'zustand';
import type { Appointment } from '@/types';
import { mockAppointments } from '@/data/appointments';

interface AppointmentStore {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  getAppointmentsByDate: (date: string) => Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
}

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  appointments: mockAppointments,

  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),

  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  cancelAppointment: (id) =>
    set((state) => ({
      appointments: state.appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' as const } : a
      ),
    })),

  getAppointmentsByDate: (date) =>
    get().appointments.filter((a) => a.date === date),

  getAppointmentsByPatient: (patientId) =>
    get().appointments.filter((a) => a.patientId === patientId),
}));
