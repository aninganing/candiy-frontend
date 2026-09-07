import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LinkButton } from './LinkButton';

describe('LinkButton', () => {
  it('href를 가진 링크로 렌더링된다', () => {
    render(<LinkButton href="/checkups">시작하기</LinkButton>);

    expect(screen.getByRole('link', { name: '시작하기' })).toHaveAttribute('href', '/checkups');
  });

  it('Button과 동일한 variant 클래스를 적용한다', () => {
    render(
      <LinkButton href="/checkups" variant="ghost-outline">
        시작하기
      </LinkButton>,
    );

    expect(screen.getByRole('link', { name: '시작하기' }).className).toContain('border');
  });
});
