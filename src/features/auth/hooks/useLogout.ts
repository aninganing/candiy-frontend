'use client';

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config/site';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useLogout(destination: string = ROUTES.home) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return function handleLogout() {
    logout();
    // user가 null이 되면 같은 화면에 마운트된 AuthGuard의 effect가 /login으로 replace한다.
    // 그 effect가 이 함수보다 나중에(커밋 이후) 실행돼 아래 push를 덮어쓰므로, 매크로태스크로 미뤄 AuthGuard의 리다이렉트 다음에 실행되게 한다.
    setTimeout(() => router.push(destination), 0);
  };
}
