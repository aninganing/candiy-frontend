import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckupDetail } from './CheckupDetail';

describe('CheckupDetail', () => {
  it('전달받은 id를 검진일로 표시한다', () => {
    render(<CheckupDetail id="2024-05-10" />);

    expect(screen.getByText('2024-05-10')).toBeInTheDocument();
  });

  it('건강검진 조회로 돌아가는 링크를 표시한다', () => {
    render(<CheckupDetail id="2024-05-10" />);

    expect(screen.getByRole('link', { name: '건강검진 조회로 돌아가기' })).toHaveAttribute(
      'href',
      '/checkups',
    );
  });
});
