'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { useState, useSyncExternalStore } from 'react';
import { createQueryClient, shouldPersistQuery } from '@/shared/api/queryClient';
import { MockProvider } from '@/shared/mocks/MockProvider';

const noopSubscribe = () => () => {};

let clientPersister: ReturnType<typeof createAsyncStoragePersister> | undefined;

function getClientPersister() {
  clientPersister ??= createAsyncStoragePersister({ storage: window.sessionStorage });
  return clientPersister;
}

// 서버는 항상 undefined를, 클라이언트는 hydration 이후에만 실제 persister를 본다 — useState 초기화 함수
// 안에서 typeof window로 분기하면 서버(undefined)와 클라이언트 첫 렌더(window 존재) 결과가 달라져 hydration mismatch가 난다.
// useSyncExternalStore의 getServerSnapshot으로 이 차이를 명시적으로 다룬다.
function usePersister() {
  return useSyncExternalStore(noopSubscribe, getClientPersister, () => undefined);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  const persister = usePersister();

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
