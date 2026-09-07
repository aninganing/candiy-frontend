'use client';

import type { ReactNode } from 'react';
import { Spinner } from '@/shared/components/feedback/Spinner';
import { useRedirectIfAuthenticated } from '@/features/auth/hooks/useRedirectIfAuthenticated';

export interface GuestOnlyProps {
  children: ReactNode;
}

export function GuestOnly({ children }: GuestOnlyProps) {
  const { isChecking } = useRedirectIfAuthenticated();

  if (isChecking) {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return children;
}
