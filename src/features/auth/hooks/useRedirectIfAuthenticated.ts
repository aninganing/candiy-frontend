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
    if (!hasHydrated) return;
    if (user) {
      router.replace(destination);
    }
    // hasHydrated가 true로 바뀌는 시점에만 한 번 검사한다. useRequireAuth와 같은 이유.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  return { isChecking: !hasHydrated || Boolean(user) };
}
