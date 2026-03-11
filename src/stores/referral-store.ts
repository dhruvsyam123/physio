import { create } from 'zustand';
import type { Referral } from '@/types';
import { mockReferrals } from '@/data/referrals';

interface ReferralStore {
  referrals: Referral[];
  addReferral: (referral: Referral) => void;
  updateReferral: (id: string, updates: Partial<Referral>) => void;
  updateReferralStatus: (id: string, status: Referral['status']) => void;
}

export const useReferralStore = create<ReferralStore>((set) => ({
  referrals: mockReferrals,

  addReferral: (referral) =>
    set((state) => ({
      referrals: [...state.referrals, referral],
    })),

  updateReferral: (id, updates) =>
    set((state) => ({
      referrals: state.referrals.map((r) =>
        r.id === id ? { ...r, ...updates } : r
      ),
    })),

  updateReferralStatus: (id, status) =>
    set((state) => ({
      referrals: state.referrals.map((r) =>
        r.id === id ? { ...r, status } : r
      ),
    })),
}));
