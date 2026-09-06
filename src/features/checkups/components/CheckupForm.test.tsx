import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CheckupForm } from './CheckupForm';

async function fillValidForm() {
  await userEvent.type(screen.getByLabelText('이름'), '홍길동');
  await userEvent.type(screen.getByLabelText('생년월일'), '19900101');
  await userEvent.type(screen.getByLabelText('휴대폰번호'), '01012345678');
}

describe('CheckupForm', () => {
  it('필수 항목을 채우지 않으면 제출 버튼이 비활성화된다', () => {
    render(<CheckupForm onSubmit={vi.fn()} />);

    expect(screen.getByRole('button', { name: '본인인증 시작' })).toBeDisabled();
  });

  it('필수 항목을 모두 채우면 제출 버튼이 활성화된다', async () => {
    render(<CheckupForm onSubmit={vi.fn()} />);

    await fillValidForm();

    expect(screen.getByRole('button', { name: '본인인증 시작' })).toBeEnabled();
  });

  it('제출 시 입력값과 기본 조회기간을 담아 onSubmit을 호출한다', async () => {
    const onSubmit = vi.fn();
    render(<CheckupForm onSubmit={onSubmit} />);

    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: '본인인증 시작' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        legalName: '홍길동',
        birthdate: '19900101',
        phoneNo: '01012345678',
        telecom: 0,
        loginTypeLevel: 1,
      }),
    );
    const [submitted] = onSubmit.mock.calls[0] as [{ startDate: string; endDate: string }];
    expect(Number(submitted.endDate) - Number(submitted.startDate)).toBe(1);
  });

  it('간편인증 수단과 통신사를 선택할 수 있다', async () => {
    const onSubmit = vi.fn();
    render(<CheckupForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole('radio', { name: '토스' }));
    await userEvent.click(screen.getByRole('radio', { name: 'KT' }));
    await fillValidForm();
    await userEvent.click(screen.getByRole('button', { name: '본인인증 시작' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ loginTypeLevel: 8, telecom: 1 }),
    );
  });

  it('isSubmitting이면 버튼이 비활성화되고 문구가 바뀐다', () => {
    render(<CheckupForm onSubmit={vi.fn()} isSubmitting />);

    expect(screen.getByRole('button', { name: '요청 중입니다...' })).toBeDisabled();
  });

  it('errorMessage가 있으면 에러 배너를 표시한다', () => {
    render(<CheckupForm onSubmit={vi.fn()} errorMessage="본인인증에 실패했습니다." />);

    expect(screen.getByRole('alert')).toHaveTextContent('본인인증에 실패했습니다.');
  });

  it('숫자가 아닌 문자를 생년월일/휴대폰번호에 입력하면 제거된다', async () => {
    render(<CheckupForm onSubmit={vi.fn()} />);

    await userEvent.type(screen.getByLabelText('생년월일'), '1990-01-01');

    expect(screen.getByLabelText('생년월일')).toHaveValue('19900101');
  });
});
