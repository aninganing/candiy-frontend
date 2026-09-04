import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('클릭 시 onClick이 호출된다', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>확인</Button>);

    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(onClick).toHaveBeenCalledOnce();
  });

  it('disabled일 때는 클릭해도 onClick이 호출되지 않는다', async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        확인
      </Button>,
    );

    await userEvent.click(screen.getByRole('button', { name: '확인' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('icon을 함께 렌더링한다', () => {
    render(<Button icon={<span data-testid="icon" />}>확인</Button>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('iconPosition이 trailing이면 아이콘이 텍스트 뒤에 온다', () => {
    render(
      <Button icon={<span data-testid="icon" />} iconPosition="trailing">
        확인
      </Button>,
    );

    const button = screen.getByRole('button', { name: '확인' });
    expect(button.lastElementChild).toHaveAttribute('data-testid', 'icon');
  });

  it('iconPosition 기본값(leading)일 때 아이콘이 텍스트 앞에 온다', () => {
    render(<Button icon={<span data-testid="icon" />}>확인</Button>);

    const button = screen.getByRole('button', { name: '확인' });
    expect(button.firstElementChild).toHaveAttribute('data-testid', 'icon');
  });
});
