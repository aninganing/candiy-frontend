import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '@/features/auth/types/auth.types';

interface AuthStore {
  user: AuthUser | null;
  hasHydrated: boolean;
  login: (name: string) => void;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      login: (name) => set({ user: { name } }),
      logout: () => set({ user: null }),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'candiy-auth',
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
