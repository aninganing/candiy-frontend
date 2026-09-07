'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/shared/hooks/useTheme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="text-foreground-muted hover:bg-surface-hover hover:text-foreground rounded-control flex h-9 w-9 items-center justify-center transition-colors"
    >
      {isDark ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
    </button>
  );
}
