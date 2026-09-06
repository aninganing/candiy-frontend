import { CircleCheck, TriangleAlert } from 'lucide-react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const alertVariants = cva(
  'flex items-center gap-2.5 rounded-control px-4 py-3.5 text-sm leading-relaxed',
  {
    variants: {
      tone: {
        danger: 'bg-danger-bg text-danger-fg',
        warning: 'bg-warning-bg text-warning-fg',
        success: 'bg-success-bg text-success-fg',
      },
    },
    defaultVariants: { tone: 'danger' },
  },
);

const DEFAULT_ICONS: Record<'danger' | 'warning' | 'success', ReactNode> = {
  danger: <TriangleAlert size={18} />,
  warning: <TriangleAlert size={18} />,
  success: <CircleCheck size={18} />,
};

export interface InlineAlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: ReactNode;
}

export function InlineAlert({ tone, icon, className, children, ...props }: InlineAlertProps) {
  const resolvedTone = tone ?? 'danger';

  return (
    <div role="alert" className={cn(alertVariants({ tone }), className)} {...props}>
      <span className="flex shrink-0">{icon ?? DEFAULT_ICONS[resolvedTone]}</span>
      <span>{children}</span>
    </div>
  );
}
