'use client';

import { useEffect, useRef, useState } from 'react';

function easeOutCubic(progress: number) {
  return 1 - (1 - progress) ** 3;
}

/**
 * from에서 target까지 값을 애니메이션한다. animate가 false면 애니메이션 없이 target을 반환한다.
 * 차트 진입 애니메이션(예: GaugeRangeChart의 채움 막대) 등에서 재사용한다.
 */
export function useAnimatedValue(target: number, from: number, animate: boolean, durationMs = 600) {
  const [animatedValue, setAnimatedValue] = useState(from);
  const frameRef = useRef<number>(undefined);

  useEffect(() => {
    if (!animate) return undefined;

    const startTime = performance.now();
    function tick(now: number) {
      const progress = Math.min(1, (now - startTime) / durationMs);
      setAnimatedValue(from + (target - from) * easeOutCubic(progress));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }
    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== undefined) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- from은 시작점일 뿐 재생 트리거로 쓰지 않는다
  }, [target, animate, durationMs]);

  return animate ? animatedValue : target;
}
