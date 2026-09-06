import { IsRestoringProvider, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { queryKeys } from '@/shared/api/queryKeys';
import { useCheckupWizardStore } from '@/features/checkups/store/checkupWizard.store';
import { Dashboard } from './Dashboard';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

afterEach(() => {
  useCheckupWizardStore.setState({ state: { step: 'idle' } });
  push.mockClear();
});

function renderDashboard(seeded: boolean) {
  const queryClient = new QueryClient();
  if (seeded) {
    queryClient.setQueryData(queryKeys.checkups.data(), toCheckupData(checkupDataFixture));
  }
  render(
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>,
  );
  return queryClient;
}

describe('Dashboard', () => {
  it('캐시에 데이터가 있으면 가장 최근 검진일을 표시한다', () => {
    renderDashboard(true);

    expect(screen.getByText('홍길동님의 최근 검진 결과')).toBeInTheDocument();
    expect(screen.getByText('2024-05-10 검진')).toBeInTheDocument();
    expect(screen.getByText('전체 검진 이력')).toBeInTheDocument();
  });

  it('캐시에 데이터가 없으면 안내 문구와 조회 링크를 표시한다', () => {
    renderDashboard(false);

    expect(screen.getByText('아직 조회된 검진 결과가 없습니다')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '건강검진 조회하기' })).toHaveAttribute(
      'href',
      '/checkups',
    );
  });

  it('sessionStorage에서 캐시를 복원하는 중이면 빈 상태 대신 스피너를 표시한다', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <IsRestoringProvider value={true}>
          <Dashboard />
        </IsRestoringProvider>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('아직 조회된 검진 결과가 없습니다')).not.toBeInTheDocument();
  });

  it('다시 검사하기를 누르면 캐시를 지우고 /checkups로 이동한다', async () => {
    const queryClient = renderDashboard(true);

    await userEvent.click(screen.getByRole('button', { name: '다시 검사하기' }));

    expect(queryClient.getQueryData(queryKeys.checkups.data())).toBeUndefined();
    expect(push).toHaveBeenCalledWith('/checkups');
  });
});
