import { Loader2 } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const spinnerVariants = cva('text-foreground-muted animate-spin', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
  label?: string;
}

export function Spinner({ size, className, label = '불러오는 중' }: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label={label}
      className={cn(spinnerVariants({ size }), className)}
    />
  );
}
