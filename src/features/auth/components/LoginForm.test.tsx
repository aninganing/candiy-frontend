import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { LoginForm } from './LoginForm';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  useAuthStore.setState({ user: null, hasHydrated: false });
  push.mockClear();
});

describe('LoginForm', () => {
  it('이름이나 비밀번호가 비어있으면 제출 버튼이 비활성화된다', async () => {
    render(<LoginForm />);

    await waitFor(() => expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled());
  });

  it('비밀번호가 영문+숫자 조합 8자 이상이 아니면 에러 메시지를 표시한다', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('비밀번호'), 'abcdefgh');

    expect(
      await screen.findByText('영문, 숫자를 포함해 8자 이상 입력해주세요'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '로그인' })).toBeDisabled();
  });

  it('이름과 형식에 맞는 비밀번호를 입력하면 제출 버튼이 활성화된다', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('이름'), '홍길동');
    await userEvent.type(screen.getByLabelText('비밀번호'), 'candiy123');

    await waitFor(() => expect(screen.getByRole('button', { name: '로그인' })).toBeEnabled());
  });

  it('제출하면 입력한 이름으로 로그인하고 /checkups로 이동한다', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('이름'), '홍길동');
    await userEvent.type(screen.getByLabelText('비밀번호'), 'candiy123');
    await waitFor(() => expect(screen.getByRole('button', { name: '로그인' })).toBeEnabled());
    await userEvent.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/checkups'));
    expect(useAuthStore.getState().user).toEqual({ name: '홍길동' });
  });
});
