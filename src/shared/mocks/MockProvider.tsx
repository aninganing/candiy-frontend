'use client';

import { useEffect, useState } from 'react';
import { clientEnv } from '@/shared/lib/env';

let startPromise: Promise<void> | null = null;

function startMockWorker(): Promise<void> {
  if (!startPromise) {
    startPromise = import('@/shared/mocks/browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass' }).then(() => undefined),
    );
  }
  return startPromise;
}

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(clientEnv.NEXT_PUBLIC_API_MODE !== 'mock');

  useEffect(() => {
    if (clientEnv.NEXT_PUBLIC_API_MODE !== 'mock') return;

    let cancelled = false;
    startMockWorker().then(() => {
      if (!cancelled) setIsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isReady) return null;

  return children;
}
