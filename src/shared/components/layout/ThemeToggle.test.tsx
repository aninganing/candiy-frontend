import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

afterEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

describe('ThemeToggle', () => {
  it('저장된 테마가 없으면 라이트 모드로 보고 해 아이콘(다크로 전환 버튼)을 보여준다', () => {
    render(<ThemeToggle />);

    expect(screen.getByRole('button', { name: '다크 모드로 전환' })).toBeInTheDocument();
  });

  it('클릭하면 다크 모드로 전환하고 localStorage/문서 속성에 반영한다', async () => {
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: '다크 모드로 전환' }));

    expect(screen.getByRole('button', { name: '라이트 모드로 전환' })).toBeInTheDocument();
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('다시 클릭하면 라이트 모드로 되돌아간다', async () => {
    render(<ThemeToggle />);

    await userEvent.click(screen.getByRole('button', { name: '다크 모드로 전환' }));
    await userEvent.click(screen.getByRole('button', { name: '라이트 모드로 전환' }));

    expect(screen.getByRole('button', { name: '다크 모드로 전환' })).toBeInTheDocument();
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('저장된 테마가 dark면 처음부터 라이트로 전환하는 버튼을 보여준다', () => {
    localStorage.setItem('theme', 'dark');

    render(<ThemeToggle />);

    expect(screen.getByRole('button', { name: '라이트 모드로 전환' })).toBeInTheDocument();
  });
});
