import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CheckupPending } from './CheckupPending';

describe('CheckupPending', () => {
  it('이름과 선택한 간편인증 수단 라벨을 안내 문구에 표시한다', () => {
    render(
      <CheckupPending
        legalName="홍길동"
        loginTypeLevel={1}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText(/홍길동님의 휴대폰에서/)).toBeInTheDocument();
    expect(screen.getByText(/카카오톡 인증을 진행해주세요/)).toBeInTheDocument();
  });

  describe('카운트다운', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('4분 30초부터 카운트다운이 시작된다', () => {
      vi.useFakeTimers();
      render(
        <CheckupPending
          legalName="홍길동"
          loginTypeLevel={1}
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      expect(screen.getByText('04:30')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText('04:27')).toBeInTheDocument();
    });

    it('시간이 0이 되면 인증 완료 버튼이 비활성화된다', () => {
      vi.useFakeTimers();
      render(
        <CheckupPending
          legalName="홍길동"
          loginTypeLevel={1}
          onConfirm={vi.fn()}
          onCancel={vi.fn()}
        />,
      );

      act(() => {
        vi.advanceTimersByTime((4 * 60 + 30) * 1000);
      });

      expect(screen.getByText('00:00')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '인증 완료' })).toBeDisabled();
    });
  });

  it('인증 완료 버튼 클릭 시 onConfirm이 호출된다', async () => {
    const onConfirm = vi.fn();
    render(
      <CheckupPending
        legalName="홍길동"
        loginTypeLevel={1}
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: '인증 완료' }));

    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('취소 버튼 클릭 시 onCancel이 호출된다', async () => {
    const onCancel = vi.fn();
    render(
      <CheckupPending
        legalName="홍길동"
        loginTypeLevel={1}
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: '취소' }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('isVerifying이면 버튼이 비활성화되고 문구가 바뀐다', () => {
    render(
      <CheckupPending
        legalName="홍길동"
        loginTypeLevel={1}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        isVerifying
      />,
    );

    expect(screen.getByRole('button', { name: '확인 중입니다...' })).toBeDisabled();
  });

  it('errorMessage가 있으면 warning 배너를 표시한다', () => {
    render(
      <CheckupPending
        legalName="홍길동"
        loginTypeLevel={1}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        errorMessage="아직 인증이 완료되지 않았습니다."
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('아직 인증이 완료되지 않았습니다.');
  });
});
