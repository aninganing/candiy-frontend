import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';
import { queryKeys } from '@/shared/api/queryKeys';
import { CheckupDetail } from './CheckupDetail';

function renderDetail(id: string, seeded: boolean) {
  const queryClient = new QueryClient();
  if (seeded) {
    queryClient.setQueryData(queryKeys.checkups.detail(), toCheckupData(checkupDataFixture));
  }
  return render(
    <QueryClientProvider client={queryClient}>
      <CheckupDetail id={id} />
    </QueryClientProvider>,
  );
}

describe('CheckupDetail', () => {
  it('캐시에 해당 검진일 데이터가 있으면 id를 검진일로 표시한다', () => {
    renderDetail('2024-05-10', true);

    expect(screen.getByText('2024-05-10')).toBeInTheDocument();
  });

  it('캐시에 데이터가 없으면(새로고침 등) 안내 문구를 표시한다', () => {
    renderDetail('2024-05-10', false);

    expect(screen.getByText('조회된 검진 데이터가 없습니다')).toBeInTheDocument();
  });

  it('건강검진 조회로 돌아가는 링크를 표시한다', () => {
    renderDetail('2024-05-10', true);

    expect(screen.getByRole('link', { name: '건강검진 조회로 돌아가기' })).toHaveAttribute(
      'href',
      '/checkups',
    );
  });
});
