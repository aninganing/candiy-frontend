import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useCheckupWizardStore } from '@/features/checkups/store/checkupWizard.store';
import { CheckupWizard } from './CheckupWizard';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  useCheckupWizardStore.setState({ state: { step: 'idle' } });
  push.mockClear();
});

function renderWizard() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <CheckupWizard />
    </QueryClientProvider>,
  );
}

describe('CheckupWizard', () => {
  it('Header에 title이 표시된다', () => {
    renderWizard();

    expect(screen.getByText('건강검진 조회')).toBeInTheDocument();
  });

  it('idle → form → pending(AE-003 재시도) → success 전체 흐름을 화면 전환과 함께 완료한다', async () => {
    renderWizard();

    expect(screen.getByText('국민건강보험공단 건강검진 결과 조회')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '건강검진 조회 시작' }));

    await userEvent.type(screen.getByLabelText('이름'), '홍길동');
    await userEvent.type(screen.getByLabelText('생년월일'), '19900101');
    await userEvent.type(screen.getByLabelText('휴대폰번호'), '01012345678');
    await userEvent.click(screen.getByRole('button', { name: '본인인증 시작' }));

    expect(await screen.findByText(/카카오톡 인증을 진행해주세요/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '인증 완료' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(
      '본인인증 절차가 완료되지 않았습니다',
    );

    await userEvent.click(screen.getByRole('button', { name: '인증 완료' }));

    expect(await screen.findByText(/홍길동님의 건강검진 조회가/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(push).toHaveBeenCalledWith('/dashboard');
  });
});
