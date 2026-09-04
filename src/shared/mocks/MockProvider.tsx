'use client';

import { useEffect, useState } from 'react';
import { clientEnv } from '@/shared/lib/env';

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(clientEnv.NEXT_PUBLIC_API_MODE !== 'mock');

  useEffect(() => {
    if (clientEnv.NEXT_PUBLIC_API_MODE !== 'mock') return;

    import('@/shared/mocks/browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass' }).then(() => setIsReady(true)),
    );
  }, []);

  if (!isReady) return null;

  return children;
}
