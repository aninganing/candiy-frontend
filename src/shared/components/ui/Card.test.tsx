import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('children을 렌더링한다', () => {
    render(<Card>카드 내용</Card>);

    expect(screen.getByText('카드 내용')).toBeInTheDocument();
  });

  it('interactive일 때 cursor-pointer 클래스가 붙는다', () => {
    render(<Card interactive>클릭 가능</Card>);

    expect(screen.getByText('클릭 가능')).toHaveClass('cursor-pointer');
  });

  it('interactive가 아닐 때는 cursor-pointer가 없다', () => {
    render(<Card>기본</Card>);

    expect(screen.getByText('기본')).not.toHaveClass('cursor-pointer');
  });

  it('className을 합성할 수 있다', () => {
    render(<Card className="custom-class">커스텀</Card>);

    expect(screen.getByText('커스텀')).toHaveClass('custom-class');
  });
});
