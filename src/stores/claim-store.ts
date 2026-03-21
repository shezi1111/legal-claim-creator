'use client';

import { create } from 'zustand';

export interface Claim {
  id: string;
  title: string;
  jurisdiction: string;
  subJurisdiction?: string;
  areaOfLaw: string;
  status: string;
  strengthScore?: number;
  strengthRating?: string;
  createdAt: string;
  updatedAt: string;
}

interface ClaimStore {
  claims: Claim[];
  currentClaim: Claim | null;
  loading: boolean;
  error: string | null;
  loadClaims: () => Promise<void>;
  loadClaim: (id: string) => Promise<void>;
  createClaim: (data: { jurisdiction: string; subJurisdiction?: string; areaOfLaw: string }) => Promise<Claim>;
  setCurrentClaim: (claim: Claim | null) => void;
}

export const useClaimStore = create<ClaimStore>((set) => ({
  claims: [],
  currentClaim: null,
  loading: false,
  error: null,

  loadClaims: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch('/api/claims');
      const data = await res.json();
      set({ claims: data.claims || [], loading: false });
    } catch (err) {
      set({ error: 'Failed to load claims', loading: false });
      console.error(err);
    }
  },

  loadClaim: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/claims/${id}`);
      if (!res.ok) throw new Error('Claim not found');
      const claim = await res.json();
      set({ currentClaim: claim, loading: false });
    } catch (err) {
      set({ error: 'Failed to load claim', loading: false });
      console.error(err);
    }
  },

  createClaim: async (data) => {
    const res = await fetch('/api/claims', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create claim');
    const claim = await res.json();
    set((state) => ({ claims: [claim, ...state.claims] }));
    return claim;
  },

  setCurrentClaim: (claim) => set({ currentClaim: claim }),
}));
