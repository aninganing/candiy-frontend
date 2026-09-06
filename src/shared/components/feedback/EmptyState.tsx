import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3 py-10 text-center', className)}>
      <span className="text-foreground-subtle">{icon ?? <Inbox size={32} />}</span>
      <div className="flex flex-col gap-1">
        <h2 className="text-foreground text-base font-semibold">{title}</h2>
        {description && (
          <p className="text-foreground-muted max-w-xs text-sm leading-relaxed">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
