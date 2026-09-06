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
  danger: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M12 9v4M12 17h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 0 0 3.46 20h17.08a1.5 1.5 0 0 0 1.35-2.14L13.71 3.86a1.5 1.5 0 0 0-2.42 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  warning: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M12 9v4M12 17h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 0 0 3.46 20h17.08a1.5 1.5 0 0 0 1.35-2.14L13.71 3.86a1.5 1.5 0 0 0-2.42 0z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  success: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.2l2.4 2.4 4.8-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export interface InlineAlertProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
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
