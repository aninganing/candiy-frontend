'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { useState } from 'react';
import { createQueryClient, shouldPersistQuery } from '@/shared/api/queryClient';
import { MockProvider } from '@/shared/mocks/MockProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  const [persister] = useState(() =>
    typeof window === 'undefined'
      ? undefined
      : createAsyncStoragePersister({ storage: window.sessionStorage }),
  );

  if (!persister) {
    return (
      <QueryClientProvider client={queryClient}>
        <MockProvider>{children}</MockProvider>
      </QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        dehydrateOptions: { shouldDehydrateQuery: shouldPersistQuery },
      }}
    >
      <MockProvider>{children}</MockProvider>
    </PersistQueryClientProvider>
  );
}
