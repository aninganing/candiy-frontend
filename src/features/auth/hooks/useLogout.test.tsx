import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useLogout } from './useLogout';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  useAuthStore.setState({ user: null, hasHydrated: false });
  push.mockClear();
});

describe('useLogout', () => {
  it('로그인 상태를 초기화하고 기본 목적지(루트)로 이동한다', async () => {
    useAuthStore.setState({ user: { name: '홍길동' }, hasHydrated: true });
    const { result } = renderHook(() => useLogout());

    act(() => {
      result.current();
    });

    expect(useAuthStore.getState().user).toBeNull();
    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
  });

  it('destination을 지정하면 해당 경로로 이동한다', async () => {
    const { result } = renderHook(() => useLogout('/somewhere'));

    act(() => {
      result.current();
    });

    await waitFor(() => expect(push).toHaveBeenCalledWith('/somewhere'));
  });
});
