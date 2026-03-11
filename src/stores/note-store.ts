import { create } from 'zustand';
import type { SOAPNote } from '@/types';
import { mockNotes } from '@/data/notes';

interface NoteStore {
  notes: SOAPNote[];
  addNote: (note: SOAPNote) => void;
  updateNote: (id: string, updates: Partial<SOAPNote>) => void;
  getNotesByPatient: (patientId: string) => SOAPNote[];
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: mockNotes,

  addNote: (note) =>
    set((state) => ({
      notes: [...state.notes, note],
    })),

  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    })),

  getNotesByPatient: (patientId) =>
    get().notes.filter((n) => n.patientId === patientId),
}));
