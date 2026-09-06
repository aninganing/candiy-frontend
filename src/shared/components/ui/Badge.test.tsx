import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  it('children을 렌더링한다', () => {
    render(<Badge>정상</Badge>);

    expect(screen.getByText('정상')).toBeInTheDocument();
  });

  it('shape 기본값(pill)일 때 rounded-badge 클래스가 붙는다', () => {
    render(<Badge>기본</Badge>);

    expect(screen.getByText('기본')).toHaveClass('rounded-badge');
  });

  it('shape가 circle이면 rounded-full 클래스가 붙는다', () => {
    render(<Badge shape="circle">C</Badge>);

    expect(screen.getByText('C')).toHaveClass('rounded-full');
  });

  it('tone별로 다른 배경 클래스가 적용된다', () => {
    render(<Badge tone="danger">위험</Badge>);

    expect(screen.getByText('위험')).toHaveClass('bg-danger-bg');
  });

  it('className을 합성할 수 있다', () => {
    render(<Badge className="custom-class">커스텀</Badge>);

    expect(screen.getByText('커스텀')).toHaveClass('custom-class');
  });

  it('circle이고 autoSizeIcon 기본값일 때 svg 크기 강제 클래스가 붙는다', () => {
    render(
      <Badge shape="circle" size="lg">
        <svg data-testid="icon" />
      </Badge>,
    );

    expect(screen.getByText('', { selector: 'span' })).toHaveClass('[&>svg]:w-7');
  });

  it('autoSizeIcon이 false면 svg 크기 강제 클래스가 붙지 않는다', () => {
    render(
      <Badge shape="circle" size="lg" autoSizeIcon={false}>
        <svg data-testid="icon" />
      </Badge>,
    );

    expect(screen.getByText('', { selector: 'span' })).not.toHaveClass('[&>svg]:w-7');
  });
});
