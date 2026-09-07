'use client';

import type { ReactNode } from 'react';
import { Spinner } from '@/shared/components/feedback/Spinner';
import { useRequireAuth } from '@/features/auth/hooks/useRequireAuth';

export interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isReady } = useRequireAuth();

  if (!isReady) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) return null;

  return children;
}
