import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InlineAlert } from './InlineAlert';

describe('InlineAlert', () => {
  it('children을 렌더링한다', () => {
    render(<InlineAlert>에러가 발생했습니다.</InlineAlert>);

    expect(screen.getByText('에러가 발생했습니다.')).toBeInTheDocument();
  });

  it('role="alert"로 렌더링된다', () => {
    render(<InlineAlert>에러가 발생했습니다.</InlineAlert>);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('tone 기본값(danger)일 때 bg-danger-bg 클래스가 붙는다', () => {
    render(<InlineAlert>에러가 발생했습니다.</InlineAlert>);

    expect(screen.getByRole('alert')).toHaveClass('bg-danger-bg');
  });

  it('tone별로 다른 배경 클래스가 적용된다', () => {
    render(<InlineAlert tone="success">완료되었습니다.</InlineAlert>);

    expect(screen.getByRole('alert')).toHaveClass('bg-success-bg');
  });

  it('icon을 지정하지 않으면 tone에 맞는 기본 아이콘이 렌더링된다', () => {
    const { container } = render(<InlineAlert tone="warning">주의하세요.</InlineAlert>);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('icon을 지정하면 기본 아이콘 대신 사용된다', () => {
    render(
      <InlineAlert icon={<span data-testid="custom-icon" />} tone="success">
        완료되었습니다.
      </InlineAlert>,
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('className으로 너비를 지정할 수 있다', () => {
    render(<InlineAlert className="w-96">에러가 발생했습니다.</InlineAlert>);

    expect(screen.getByRole('alert')).toHaveClass('w-96');
  });

  it('className으로 텍스트 크기를 오버라이드하면 text-sm 대신 적용된다', () => {
    render(<InlineAlert className="text-base">에러가 발생했습니다.</InlineAlert>);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('text-base');
    expect(alert).not.toHaveClass('text-sm');
  });
});
