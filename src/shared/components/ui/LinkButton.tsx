import Link from 'next/link';
import type { ComponentProps } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';
import { buttonVariants } from './buttonVariants';

export interface LinkButtonProps
  extends ComponentProps<typeof Link>,
    VariantProps<typeof buttonVariants> {}

export function LinkButton({ variant, size, fullWidth, className, ...props }: LinkButtonProps) {
  return <Link className={cn(buttonVariants({ variant, size, fullWidth }), className)} {...props} />;
}
