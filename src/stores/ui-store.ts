import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  sidebarCollapsed: boolean;
  aiPanelOpen: boolean;
  activePage: string;
  selectedPatientId: string | null;
  toggleSidebar: () => void;
  toggleAiPanel: () => void;
  setActivePage: (page: string) => void;
  setSelectedPatient: (patientId: string | null) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      aiPanelOpen: false,
      activePage: 'dashboard',
      selectedPatientId: null,

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      toggleAiPanel: () =>
        set((state) => ({ aiPanelOpen: !state.aiPanelOpen })),

      setActivePage: (page) =>
        set({ activePage: page }),

      setSelectedPatient: (patientId) =>
        set({ selectedPatientId: patientId }),
    }),
    {
      name: 'physio-ui',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
