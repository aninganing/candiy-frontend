import { IsRestoringProvider, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CheckupData } from '@/features/checkups/types/checkup.types';
import { useCheckupData } from './useCheckupData';

const sampleData: CheckupData = {
  patientName: '홍길동',
  overviews: [],
  references: [],
  records: [],
};

function renderWithQueryClient(queryClient: QueryClient) {
  return renderHook(() => useCheckupData(), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

describe('useCheckupData', () => {
  it('캐시에 값이 있으면 그대로 반환한다', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.checkups.data(), sampleData);

    const { result } = renderWithQueryClient(queryClient);

    expect(result.current.data).toEqual(sampleData);
  });

  it('캐시가 비어 있으면 undefined를 반환하고 직접 fetch를 시도하지 않는다', () => {
    const queryClient = new QueryClient();

    const { result } = renderWithQueryClient(queryClient);

    expect(result.current.data).toBeUndefined();
  });

  it('sessionStorage에서 캐시를 복원하는 중이면 isRestoring이 true다', () => {
    const queryClient = new QueryClient();

    const { result } = renderHook(() => useCheckupData(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <IsRestoringProvider value={true}>{children}</IsRestoringProvider>
        </QueryClientProvider>
      ),
    });

    expect(result.current.isRestoring).toBe(true);
  });
});
