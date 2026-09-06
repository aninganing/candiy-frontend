import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { queryKeys } from '@/shared/api/queryKeys';
import type { CheckupData } from '@/features/checkups/types/checkup.types';
import { useCheckupDetail } from './useCheckupDetail';

const sampleData: CheckupData = {
  patientName: '홍길동',
  overviews: [
    { checkupDate: '2023-04-22' } as CheckupData['overviews'][number],
    { checkupDate: '2024-05-10' } as CheckupData['overviews'][number],
  ],
  references: [],
  records: [],
};

function renderDetail(checkupDate: string, queryClient: QueryClient) {
  return renderHook(() => useCheckupDetail(checkupDate), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
}

describe('useCheckupDetail', () => {
  it('checkupDate와 일치하는 overview를 selectedOverview로 반환한다', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.checkups.detail(), sampleData);

    const { result } = renderDetail('2023-04-22', queryClient);

    expect(result.current.data).toEqual(sampleData);
    expect(result.current.selectedOverview).toEqual(sampleData.overviews[0]);
  });

  it('일치하는 overview가 없으면 selectedOverview는 undefined다', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.checkups.detail(), sampleData);

    const { result } = renderDetail('2099-01-01', queryClient);

    expect(result.current.selectedOverview).toBeUndefined();
  });

  it('캐시가 비어 있으면 data와 selectedOverview 모두 undefined다', () => {
    const queryClient = new QueryClient();

    const { result } = renderDetail('2024-05-10', queryClient);

    expect(result.current.data).toBeUndefined();
    expect(result.current.selectedOverview).toBeUndefined();
  });
});
