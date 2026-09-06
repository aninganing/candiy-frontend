import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('기본적으로 role="status"와 접근성 라벨을 갖는다', () => {
    render(<Spinner />);

    expect(screen.getByRole('status', { name: '불러오는 중' })).toBeInTheDocument();
  });

  it('label prop으로 접근성 문구를 바꿀 수 있다', () => {
    render(<Spinner label="검진 데이터 불러오는 중" />);

    expect(screen.getByRole('status', { name: '검진 데이터 불러오는 중' })).toBeInTheDocument();
  });

  it('size에 따라 다른 크기 클래스를 적용한다', () => {
    render(<Spinner size="lg" />);

    expect(screen.getByRole('status')).toHaveClass('h-8', 'w-8');
  });
});
