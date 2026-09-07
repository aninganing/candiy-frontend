import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { queryKeys } from '@/shared/api/queryKeys';
import { useCheckupWizardStore } from '@/features/checkups/store/checkupWizard.store';
import { useResetCheckup } from './useResetCheckup';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  useCheckupWizardStore.setState({ state: { step: 'idle' } });
  push.mockClear();
});

describe('useResetCheckup', () => {
  it('캐시된 검진 데이터를 지우고 위저드를 idle로 되돌린 뒤 /checkups로 이동한다', () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(queryKeys.checkups.data(), { patientName: '홍길동' });
    useCheckupWizardStore.setState({ state: { step: 'success' } });

    const { result } = renderHook(() => useResetCheckup(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });

    act(() => {
      result.current();
    });

    expect(queryClient.getQueryData(queryKeys.checkups.data())).toBeUndefined();
    expect(useCheckupWizardStore.getState().state).toEqual({ step: 'idle' });
    expect(push).toHaveBeenCalledWith('/checkups');
  });
});
