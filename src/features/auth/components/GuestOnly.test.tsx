import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { GuestOnly } from './GuestOnly';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

afterEach(() => {
  useAuthStore.setState({ user: null, hasHydrated: false });
  replace.mockClear();
});

describe('GuestOnly', () => {
  it('하이드레이션 전에는 로딩 상태를 보여준다', () => {
    useAuthStore.setState({ user: null, hasHydrated: false });

    render(
      <GuestOnly>
        <div>로그인 폼</div>
      </GuestOnly>,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('로그인 폼')).not.toBeInTheDocument();
  });

  it('이미 로그인된 상태면 /checkups로 이동시키고 children을 렌더링하지 않는다', () => {
    useAuthStore.setState({ user: { name: '홍길동' }, hasHydrated: true });

    render(
      <GuestOnly>
        <div>로그인 폼</div>
      </GuestOnly>,
    );

    expect(replace).toHaveBeenCalledWith('/checkups');
    expect(screen.queryByText('로그인 폼')).not.toBeInTheDocument();
  });

  it('로그인 상태가 아니면 children을 렌더링한다', () => {
    useAuthStore.setState({ user: null, hasHydrated: true });

    render(
      <GuestOnly>
        <div>로그인 폼</div>
      </GuestOnly>,
    );

    expect(screen.getByText('로그인 폼')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
