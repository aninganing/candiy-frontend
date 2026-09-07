import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { AuthGuard } from './AuthGuard';

const replace = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace }),
}));

afterEach(() => {
  useAuthStore.setState({ user: null, hasHydrated: false });
  replace.mockClear();
});

describe('AuthGuard', () => {
  it('하이드레이션 전에는 로딩 상태를 보여준다', () => {
    useAuthStore.setState({ user: null, hasHydrated: false });

    render(
      <AuthGuard>
        <div>보호된 콘텐츠</div>
      </AuthGuard>,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('보호된 콘텐츠')).not.toBeInTheDocument();
  });

  it('하이드레이션 후 로그인 상태가 아니면 로그인 페이지로 이동시키고 아무것도 렌더링하지 않는다', () => {
    useAuthStore.setState({ user: null, hasHydrated: true });

    render(
      <AuthGuard>
        <div>보호된 콘텐츠</div>
      </AuthGuard>,
    );

    expect(replace).toHaveBeenCalledWith('/login');
    expect(screen.queryByText('보호된 콘텐츠')).not.toBeInTheDocument();
  });

  it('로그인 상태면 children을 렌더링한다', () => {
    useAuthStore.setState({ user: { name: '홍길동' }, hasHydrated: true });

    render(
      <AuthGuard>
        <div>보호된 콘텐츠</div>
      </AuthGuard>,
    );

    expect(screen.getByText('보호된 콘텐츠')).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});
