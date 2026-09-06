import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('CANDiY 로고 텍스트를 항상 렌더링한다', () => {
    render(<Header />);

    expect(screen.getByText('CANDiY')).toBeInTheDocument();
  });

  it('title이 없으면 부제를 렌더링하지 않는다', () => {
    render(<Header />);

    expect(screen.queryByText('건강검진 조회')).not.toBeInTheDocument();
  });

  it('title이 있으면 부제로 렌더링한다', () => {
    render(<Header title="건강검진 조회" />);

    expect(screen.getByText('건강검진 조회')).toBeInTheDocument();
  });

  it('actions를 우측 영역에 렌더링한다', () => {
    render(<Header actions={<button>로그아웃</button>} />);

    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });

  it('actions가 없어도 테마 토글 버튼은 항상 렌더링한다', () => {
    render(<Header />);

    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('header 요소로 렌더링된다', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
