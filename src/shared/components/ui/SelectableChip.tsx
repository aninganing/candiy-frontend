import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const chipVariants = cva(
  'flex items-center justify-center gap-1.5 whitespace-nowrap rounded-control border font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      selected: {
        true: 'border-primary bg-primary/10 text-primary',
        false: 'border-border bg-surface text-foreground-muted hover:bg-surface-hover',
      },
      size: {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-3 py-2.5 text-sm',
        lg: 'px-4 py-3 text-base',
      },
    },
    defaultVariants: { selected: false, size: 'md' },
  },
);

export interface SelectableChipProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof chipVariants> {
  icon?: ReactNode;
  /**
   * 여러 개 중 하나만 고르는 그룹(간편인증 수단, 통신사)은 role="radio"(기본값)로
   * aria-checked를 쓰고, 독립적인 on/off 토글은 role="button"으로 aria-pressed를 쓴다.
   */
  role?: 'radio' | 'button';
}

export function SelectableChip({
  selected,
  size,
  icon,
  role = 'radio',
  className,
  children,
  ...props
}: SelectableChipProps) {
  const isSelected = selected ?? false;

  return (
    <button
      type="button"
      role={role}
      aria-checked={role === 'radio' ? isSelected : undefined}
      aria-pressed={role === 'button' ? isSelected : undefined}
      className={cn(chipVariants({ selected, size }), className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
