import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { queryKeys } from '@/shared/api/queryKeys';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useCheckupWizardStore } from '@/features/checkups/store/checkupWizard.store';
import { useLogout } from './useLogout';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  useAuthStore.setState({ user: null, hasHydrated: false });
  useCheckupWizardStore.setState({ state: { step: 'idle' } });
  push.mockClear();
});

function renderUseLogout(destination?: string) {
  const queryClient = new QueryClient();
  const { result } = renderHook(() => useLogout(destination), {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
  });
  return { result, queryClient };
}

describe('useLogout', () => {
  it('로그인 상태를 초기화하고 기본 목적지(루트)로 이동한다', async () => {
    useAuthStore.setState({ user: { name: '홍길동' }, hasHydrated: true });
    const { result } = renderUseLogout();

    act(() => {
      result.current();
    });

    expect(useAuthStore.getState().user).toBeNull();
    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
  });

  it('destination을 지정하면 해당 경로로 이동한다', async () => {
    const { result } = renderUseLogout('/somewhere');

    act(() => {
      result.current();
    });

    await waitFor(() => expect(push).toHaveBeenCalledWith('/somewhere'));
  });

  it('캐시된 검진 데이터를 지우고 위저드 진행 단계를 idle로 되돌린다', () => {
    useCheckupWizardStore.setState({ state: { step: 'success' } });
    const { result, queryClient } = renderUseLogout();
    queryClient.setQueryData(queryKeys.checkups.data(), { patientName: '홍길동' });

    act(() => {
      result.current();
    });

    expect(queryClient.getQueryData(queryKeys.checkups.data())).toBeUndefined();
    expect(useCheckupWizardStore.getState().state).toEqual({ step: 'idle' });
  });
});
