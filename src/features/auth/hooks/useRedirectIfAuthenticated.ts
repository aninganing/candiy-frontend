'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/site';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useRedirectIfAuthenticated(destination: string = ROUTES.checkups) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && user) {
      router.replace(destination);
    }
  }, [hasHydrated, user, router, destination]);

  return { isChecking: !hasHydrated || Boolean(user) };
}
