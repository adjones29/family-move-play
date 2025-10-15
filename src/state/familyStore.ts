import { create } from 'zustand';

export type FamilyMember = {
  id: string;
  display_name: string | null;
  avatar_url?: string | null;
  role?: string;
  points?: number;
};

export type FamilyState = {
  familyId?: string;
  members: FamilyMember[];
  setFamily: (familyId: string) => void;
  setMembers: (members: FamilyMember[]) => void;
  updateMember: (memberId: string, updates: Partial<FamilyMember>) => void;
  clear: () => void;
};

export const useFamilyStore = create<FamilyState>((set) => ({
  familyId: undefined,
  members: [],
  setFamily: (familyId) => set({ familyId }),
  setMembers: (members) => set({ members }),
  updateMember: (memberId, updates) =>
    set((state) => ({
      members: state.members.map((m) =>
        m.id === memberId ? { ...m, ...updates } : m
      ),
    })),
  clear: () => set({ familyId: undefined, members: [] }),
}));
