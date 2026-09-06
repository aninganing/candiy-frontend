import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { toCheckupData } from '@/features/checkups/mappers/checkup.mapper';
import { checkupDataFixture } from '@/shared/mocks/fixtures/checkup.fixtures';

vi.mock('react-chartjs-2', () => ({
  Bar: () => null,
}));

const { HistoryPanel } = await import('./HistoryPanel');

const data = toCheckupData(checkupDataFixture);

describe('HistoryPanel', () => {
  it('검진일 pill을 최신순으로 보여주고 기본으로 최신 검진의 항목을 표시한다', () => {
    render(<HistoryPanel overviews={data.overviews} references={data.references} />);

    const pills = screen.getAllByRole('radio');
    expect(pills.map((pill) => pill.textContent)).toEqual(['2024-05-10', '2023-04-22']);
    expect(pills[0]).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('23.5')).toBeInTheDocument();
  });

  it('다른 검진일 pill을 선택하면 해당 회차 값으로 바뀐다', async () => {
    render(<HistoryPanel overviews={data.overviews} references={data.references} />);

    await userEvent.click(screen.getByRole('radio', { name: '2023-04-22' }));

    expect(screen.getByText('24.1')).toBeInTheDocument();
  });

  it('제목을 누르면 접히고, 다시 누르면 펼쳐진다', async () => {
    render(<HistoryPanel overviews={data.overviews} references={data.references} />);

    const toggle = screen.getByRole('button', { name: '전체 검진 이력' });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('radio')).toHaveLength(2);

    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();

    await userEvent.click(toggle);

    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('radio')).toHaveLength(2);
  });
});
