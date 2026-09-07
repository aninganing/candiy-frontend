'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/site';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useRequireAuth() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user) {
      router.replace(ROUTES.login);
    }
    // hasHydrated가 true로 바뀌는 시점(마운트/하이드레이션 완료)에만 한 번 검사한다.
    // user를 deps에 넣으면 로그아웃으로 user가 null이 될 때마다 재실행돼 useLogout이 의도한 이동(예: 루트)을 이 replace(/login)가 덮어써버린다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  return { user, isReady: hasHydrated };
}
