import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const cardVariants = cva('bg-surface border border-border rounded-card shadow-card', {
  variants: {
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    interactive: {
      true: 'cursor-pointer transition-colors hover:border-border-strong',
    },
  },
  defaultVariants: { padding: 'md' },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export function Card({ padding, interactive, className, ...props }: CardProps) {
  return <div className={cn(cardVariants({ padding, interactive }), className)} {...props} />;
}
