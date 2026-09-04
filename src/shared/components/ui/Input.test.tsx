import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('label과 input이 htmlFor/id로 연결된다', () => {
    render(<Input label="이름" />);

    expect(screen.getByLabelText('이름')).toBeInTheDocument();
  });

  it('label이 없으면 label 요소를 렌더링하지 않는다', () => {
    render(<Input placeholder="홍길동" />);

    expect(screen.queryByRole('textbox')?.closest('div')?.querySelector('label')).toBeNull();
  });

  it('타이핑한 값이 반영된다', async () => {
    render(<Input label="이름" />);

    await userEvent.type(screen.getByLabelText('이름'), '홍길동');

    expect(screen.getByLabelText('이름')).toHaveValue('홍길동');
  });

  it('errorText가 있으면 helperText 대신 표시되고 aria-invalid가 설정된다', () => {
    render(
      <Input label="휴대폰번호" helperText="숫자만 입력" errorText="형식이 올바르지 않습니다." />,
    );

    expect(screen.getByText('형식이 올바르지 않습니다.')).toBeInTheDocument();
    expect(screen.queryByText('숫자만 입력')).not.toBeInTheDocument();
    expect(screen.getByLabelText('휴대폰번호')).toHaveAttribute('aria-invalid', 'true');
  });

  it('errorText가 없으면 helperText가 표시된다', () => {
    render(<Input label="생년월일" helperText="YYYYMMDD 형식" />);

    expect(screen.getByText('YYYYMMDD 형식')).toBeInTheDocument();
  });

  it('icon을 렌더링한다', () => {
    render(<Input label="이름" icon={<span data-testid="icon" />} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('layout이 horizontal이면 label과 입력창이 같은 행(flex row)에 놓인다', () => {
    render(<Input label="이름" layout="horizontal" />);

    const label = screen.getByText('이름');
    const input = screen.getByLabelText('이름');
    expect(label.parentElement).toBe(input.closest('.relative')?.parentElement);
    expect(label.parentElement).toHaveClass('items-center');
  });

  it('layout 기본값(vertical)일 때는 label과 입력창을 감싸는 행(flex row) 래퍼가 없다', () => {
    render(<Input label="이름" />);

    const label = screen.getByText('이름');
    expect(label.parentElement).not.toHaveClass('items-center');
  });
});
