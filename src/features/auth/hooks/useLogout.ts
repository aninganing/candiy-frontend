'use client';

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '@/config/site';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useCheckupWizardStore } from '@/features/checkups/store/checkupWizard.store';

export function useLogout(destination: string = ROUTES.home) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const resetWizard = useCheckupWizardStore((state) => state.reset);
  const queryClient = useQueryClient();

  return function handleLogout() {
    queryClient.clear();
    resetWizard();
    logout();
    router.push(destination);
  };
}
