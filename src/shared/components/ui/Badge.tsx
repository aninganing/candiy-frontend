import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const badgeVariants = cva('inline-flex items-center justify-center font-semibold', {
  variants: {
    shape: {
      circle: 'rounded-full aspect-square',
      pill: 'rounded-badge gap-1.5',
    },
    tone: {
      primary: 'bg-primary/10 text-primary',
      success: 'bg-success-bg text-success-fg',
      warning: 'bg-warning-bg text-warning-fg',
      danger: 'bg-danger-bg text-danger-fg',
      neutral: 'bg-surface-hover text-foreground-muted',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
    autoSizeIcon: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { shape: 'circle', size: 'sm', class: 'w-8 h-8 text-xs' },
    { shape: 'circle', size: 'md', class: 'w-12 h-12 text-sm' },
    { shape: 'circle', size: 'lg', class: 'w-16 h-16 text-base' },
    { shape: 'pill', size: 'sm', class: 'px-2 py-0.5 text-xs' },
    { shape: 'pill', size: 'md', class: 'px-2.5 py-1 text-sm' },
    { shape: 'pill', size: 'lg', class: 'px-3 py-1.5 text-base' },
    { shape: 'circle', size: 'sm', autoSizeIcon: true, class: '[&>svg]:w-4 [&>svg]:h-4' },
    { shape: 'circle', size: 'md', autoSizeIcon: true, class: '[&>svg]:w-5 [&>svg]:h-5' },
    { shape: 'circle', size: 'lg', autoSizeIcon: true, class: '[&>svg]:w-7 [&>svg]:h-7' },
  ],
  defaultVariants: { shape: 'pill', tone: 'neutral', size: 'md', autoSizeIcon: true },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ shape, tone, size, autoSizeIcon, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ shape, tone, size, autoSizeIcon }), className)}
      {...props}
    />
  );
}
