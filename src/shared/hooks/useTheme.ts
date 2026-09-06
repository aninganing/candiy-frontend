'use client';

import { useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';
const listeners = new Set<() => void>();

function readStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function readSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getSnapshot(): Theme {
  return readStoredTheme() ?? readSystemTheme();
}

// 서버는 다크모드 선호도를 알 수 없어 고정값을 준다 — hydration 이후 getSnapshot이 실제 값으로 다시 계산한다.
function getServerSnapshot(): Theme {
  return 'light';
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  media.addEventListener('change', onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    media.removeEventListener('change', onStoreChange);
  };
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function setTheme(next: Theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage를 못 쓰는 환경(프라이버시 모드 등)에서도 화면 전환 자체는 되게 한다.
    }
    applyTheme(next);
    listeners.forEach((listener) => listener());
  }

  return { theme, setTheme };
}
