import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-control font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
        'primary-outline': 'bg-transparent border border-primary text-primary hover:bg-primary/10',
        ghost: 'bg-surface-hover border border-border text-foreground-muted hover:bg-border-strong',
        'ghost-outline':
          'bg-transparent border border-foreground-muted text-foreground-muted hover:bg-surface-hover',
        success: 'bg-success text-success-foreground hover:opacity-90',
        'success-outline': 'bg-transparent border border-success text-success hover:bg-success/10',
        warning: 'bg-warning text-warning-foreground hover:opacity-90',
        'warning-outline': 'bg-transparent border border-warning text-warning hover:bg-warning/10',
        danger: 'bg-danger text-danger-foreground hover:opacity-90',
        'danger-outline': 'bg-transparent border border-danger text-danger hover:bg-danger/10',
      },
      size: {
        md: 'text-sm px-4 py-2.5',
        lg: 'text-[15px] px-5 py-[15px]',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);
