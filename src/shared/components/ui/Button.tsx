import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';
import { buttonVariants } from './buttonVariants';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  icon?: ReactNode;
  iconPosition?: 'leading' | 'trailing';
}

export function Button({
  variant,
  size,
  fullWidth,
  icon,
  iconPosition = 'leading',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...props}>
      {icon && iconPosition === 'leading' && icon}
      {children}
      {icon && iconPosition === 'trailing' && icon}
    </button>
  );
}
