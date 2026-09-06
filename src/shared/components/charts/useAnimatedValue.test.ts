import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useAnimatedValue } from './useAnimatedValue';

describe('useAnimatedValue', () => {
  it('animate가 false면 애니메이션 없이 target을 즉시 반환한다', () => {
    const { result } = renderHook(() => useAnimatedValue(45, 0, false));

    expect(result.current).toBe(45);
  });

  it('animate가 true면 마운트 직후엔 from에서 시작해 아직 target에 도달하지 않는다', () => {
    const { result } = renderHook(() => useAnimatedValue(45, 0, true));

    expect(result.current).toBe(0);
  });
});
