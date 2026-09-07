import type { HTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/shared/lib/cn';
import { ROUTES } from '@/config/site';
import { ThemeToggle } from './ThemeToggle';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  actions?: ReactNode;
}

export function Header({ title, actions, className, ...props }: HeaderProps) {
  return (
    <header
      className={cn(
        'border-border flex items-center gap-2 border-b px-4 py-5 sm:px-8',
        className,
      )}
      {...props}
    >
      <Link href={ROUTES.home} className="flex shrink-0 items-center gap-2">
        <span className="text-xl leading-none" aria-hidden="true">
          🍬
        </span>
        <span className="text-foreground text-[15px] font-extrabold tracking-tight">CANDiY</span>
      </Link>
      {title && (
        <span className="text-foreground-subtle ml-0.5 min-w-0 truncate text-sm">{title}</span>
      )}
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        {actions}
        <ThemeToggle />
      </div>
    </header>
  );
}
