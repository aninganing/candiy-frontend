import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CheckupIntro } from './CheckupIntro';

describe('CheckupIntro', () => {
  it('제목과 안내 문구를 렌더링한다', () => {
    render(<CheckupIntro onStart={vi.fn()} />);

    expect(screen.getByText('국민건강보험공단 건강검진 결과 조회')).toBeInTheDocument();
  });

  it('버튼 클릭 시 onStart가 호출된다', async () => {
    const onStart = vi.fn();
    render(<CheckupIntro onStart={onStart} />);

    await userEvent.click(screen.getByRole('button', { name: '건강검진 조회 시작' }));

    expect(onStart).toHaveBeenCalledOnce();
  });

  it('userName이 있으면 제목 앞에 붙는다', () => {
    render(<CheckupIntro onStart={vi.fn()} userName="홍길동" />);

    expect(screen.getByText('홍길동님의 국민건강보험공단 건강검진 결과 조회')).toBeInTheDocument();
  });
});
