import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SelectableChip } from './SelectableChip';

describe('SelectableChip', () => {
  it('children을 렌더링한다', () => {
    render(<SelectableChip>카카오톡</SelectableChip>);

    expect(screen.getByText('카카오톡')).toBeInTheDocument();
  });

  it('role 기본값(radio)일 때 selected가 false면 aria-checked가 false다', () => {
    render(<SelectableChip>카카오톡</SelectableChip>);

    expect(screen.getByRole('radio')).toHaveAttribute('aria-checked', 'false');
  });

  it('role 기본값(radio)일 때 selected가 true면 aria-checked가 true이고 선택 스타일이 적용된다', () => {
    render(<SelectableChip selected>카카오톡</SelectableChip>);

    const chip = screen.getByRole('radio');
    expect(chip).toHaveAttribute('aria-checked', 'true');
    expect(chip).not.toHaveAttribute('aria-pressed');
    expect(chip).toHaveClass('border-primary');
  });

  it('role="button"이면 aria-pressed를 쓰고 aria-checked는 없다', () => {
    render(
      <SelectableChip role="button" selected>
        카카오톡
      </SelectableChip>,
    );

    const chip = screen.getByRole('button');
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).not.toHaveAttribute('aria-checked');
  });

  it('클릭 시 onClick이 호출된다', async () => {
    const onClick = vi.fn();
    render(<SelectableChip onClick={onClick}>카카오톡</SelectableChip>);

    await userEvent.click(screen.getByRole('radio'));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('icon을 함께 렌더링한다', () => {
    render(<SelectableChip icon={<span data-testid="icon" />}>카카오톡</SelectableChip>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('type="button"으로 렌더링되어 form 제출을 트리거하지 않는다', () => {
    render(<SelectableChip>카카오톡</SelectableChip>);

    expect(screen.getByRole('radio')).toHaveAttribute('type', 'button');
  });

  it('size 기본값(md)일 때 text-sm 클래스가 붙는다', () => {
    render(<SelectableChip>카카오톡</SelectableChip>);

    expect(screen.getByRole('radio')).toHaveClass('text-sm');
  });

  it('size가 lg면 text-base 클래스가 붙는다', () => {
    render(<SelectableChip size="lg">카카오톡</SelectableChip>);

    expect(screen.getByRole('radio')).toHaveClass('text-base');
  });

  it('disabled면 흐려지고 pointer 이벤트가 막힌다', () => {
    render(<SelectableChip disabled>카카오톡</SelectableChip>);

    const chip = screen.getByRole('radio');
    expect(chip).toBeDisabled();
    expect(chip).toHaveClass('disabled:opacity-50', 'disabled:pointer-events-none');
  });

  it('disabled면 클릭해도 onClick이 호출되지 않는다', async () => {
    const onClick = vi.fn();
    render(
      <SelectableChip disabled onClick={onClick}>
        카카오톡
      </SelectableChip>,
    );

    await userEvent.click(screen.getByRole('radio'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('role="button"에서 여러 칩이 동시에 selected=true일 수 있다', () => {
    render(
      <div>
        <SelectableChip role="button" selected>
          일반검진
        </SelectableChip>
        <SelectableChip role="button" selected>
          암검진
        </SelectableChip>
      </div>,
    );

    const chips = screen.getAllByRole('button');
    expect(chips).toHaveLength(2);
    chips.forEach((chip) => expect(chip).toHaveAttribute('aria-pressed', 'true'));
  });
});
