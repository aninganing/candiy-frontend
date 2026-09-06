import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface HeaderProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  actions?: ReactNode;
}

export function Header({ title, actions, className, ...props }: HeaderProps) {
  return (
    <header
      className={cn('border-border flex items-center gap-2 border-b px-8 py-5', className)}
      {...props}
    >
      <span className="text-xl leading-none" aria-hidden="true">
        🍬
      </span>
      <span className="text-foreground text-[15px] font-extrabold tracking-tight">CANDiY</span>
      {title && <span className="text-foreground-subtle ml-0.5 text-sm">{title}</span>}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </header>
  );
}
