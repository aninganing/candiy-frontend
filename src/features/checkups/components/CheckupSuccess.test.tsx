import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CheckupData } from '@/features/checkups/types/checkup.types';
import { CheckupSuccess } from './CheckupSuccess';

const sampleData: CheckupData = {
  patientName: '홍길동',
  overviews: [
    { checkupDate: '2023-04-22' } as CheckupData['overviews'][number],
    { checkupDate: '2024-05-10' } as CheckupData['overviews'][number],
  ],
  references: [],
  records: [{} as CheckupData['records'][number], {} as CheckupData['records'][number]],
};

describe('CheckupSuccess', () => {
  it('환자 이름을 완료 문구에 표시한다', () => {
    render(<CheckupSuccess data={sampleData} onConfirm={vi.fn()} onReset={vi.fn()} />);

    expect(screen.getByText(/홍길동님의 건강검진 조회가/)).toBeInTheDocument();
  });

  it('조회된 검진 건수를 표시한다', () => {
    render(<CheckupSuccess data={sampleData} onConfirm={vi.fn()} onReset={vi.fn()} />);

    expect(screen.getByText('2건')).toBeInTheDocument();
  });

  it('overviews 중 가장 최근 검진일을 표시한다', () => {
    render(<CheckupSuccess data={sampleData} onConfirm={vi.fn()} onReset={vi.fn()} />);

    expect(screen.getByText('2024-05-10')).toBeInTheDocument();
  });

  it('overviews가 비어 있으면 최근 검진일에 -를 표시한다', () => {
    render(
      <CheckupSuccess
        data={{ ...sampleData, overviews: [] }}
        onConfirm={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('확인 버튼 클릭 시 onConfirm이 호출된다', async () => {
    const onConfirm = vi.fn();
    render(<CheckupSuccess data={sampleData} onConfirm={onConfirm} onReset={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('다시 조회하기 버튼 클릭 시 onReset이 호출된다', async () => {
    const onReset = vi.fn();
    render(<CheckupSuccess data={sampleData} onConfirm={vi.fn()} onReset={onReset} />);

    await userEvent.click(screen.getByRole('button', { name: '다시 조회하기' }));

    expect(onReset).toHaveBeenCalledOnce();
  });
});
