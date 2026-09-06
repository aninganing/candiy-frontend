'use client';

import { useEffect, useState } from 'react';

export interface ChartColors {
  foreground: string;
  foregroundMuted: string;
  foregroundSubtle: string;
  border: string;
  borderStrong: string;
  surface: string;
  primary: string;
  success: string;
  successBg: string;
  warning: string;
  danger: string;
}

export type ChartStatus = 'normal' | 'warning' | 'danger';

// 정상은 별도 강조색 없이 본문 텍스트색으로 두고, 주의/위험만 색으로 강조한다.
export function getStatusColor(colors: ChartColors, status: ChartStatus): string {
  if (status === 'danger') return colors.danger;
  if (status === 'warning') return colors.warning;
  return colors.foreground;
}

// globals.css의 :root(/다크모드 오버라이드)에 정의된 원시 변수명. Chart.js는 canvas에 그리므로 var(--x) 문자열을 그대로 못 쓰고, 실제 계산된 색상값을 읽어와야 한다.
const CSS_VARS: Record<keyof ChartColors, string> = {
  foreground: '--foreground',
  foregroundMuted: '--foreground-muted',
  foregroundSubtle: '--foreground-subtle',
  border: '--border',
  borderStrong: '--border-strong',
  surface: '--surface',
  primary: '--primary',
  success: '--success',
  successBg: '--success-bg',
  warning: '--warning',
  danger: '--danger',
};

const FALLBACK_COLORS: ChartColors = {
  foreground: '#0f172a',
  foregroundMuted: '#475569',
  foregroundSubtle: '#94a3b8',
  border: '#e2e8f0',
  borderStrong: '#cbd5e1',
  surface: '#ffffff',
  primary: '#2563eb',
  success: '#16a34a',
  successBg: '#dcfce7',
  warning: '#ea580c',
  danger: '#dc2626',
};

function readChartColors(): ChartColors {
  const styles = getComputedStyle(document.documentElement);
  const result = { ...FALLBACK_COLORS };
  (Object.keys(CSS_VARS) as (keyof ChartColors)[]).forEach((key) => {
    const value = styles.getPropertyValue(CSS_VARS[key]).trim();
    if (value) result[key] = value;
  });
  return result;
}

// 다크모드가 prefers-color-scheme 기반이라, 시스템 설정이 바뀌면 다시 읽어서 차트를 갱신한다.
export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>(() =>
    typeof window === 'undefined' ? FALLBACK_COLORS : readChartColors(),
  );

  useEffect(() => {
    const handleChange = () => setColors(readChartColors());

    // 실제 앱은 prefers-color-scheme만 바뀌지만, Storybook 다크모드 토글처럼 data-theme 속성으로 강제 전환하는 경우도 감지해야 캔버스 색상이 stale 되지 않는다.
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', handleChange);

    const observer = new MutationObserver(handleChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    });

    return () => {
      media.removeEventListener('change', handleChange);
      observer.disconnect();
    };
  }, []);

  return colors;
}
