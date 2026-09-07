'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/site';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useLogout(destination: string = ROUTES.home) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return function handleLogout() {
    logout();
    router.push(destination);
  };
}
