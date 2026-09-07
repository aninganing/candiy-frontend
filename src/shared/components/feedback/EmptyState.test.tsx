import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('title을 렌더링한다', () => {
    render(<EmptyState title="조회된 데이터가 없습니다" />);

    expect(screen.getByText('조회된 데이터가 없습니다')).toBeInTheDocument();
  });

  it('description을 전달하면 함께 렌더링한다', () => {
    render(<EmptyState title="제목" description="설명입니다" />);

    expect(screen.getByText('설명입니다')).toBeInTheDocument();
  });

  it('description을 생략하면 렌더링하지 않는다', () => {
    render(<EmptyState title="제목" />);

    expect(screen.queryByText('설명입니다')).not.toBeInTheDocument();
  });

  it('action을 전달하면 함께 렌더링한다', () => {
    render(<EmptyState title="제목" action={<button>다시 시도</button>} />);

    expect(screen.getByRole('button', { name: '다시 시도' })).toBeInTheDocument();
  });
});
