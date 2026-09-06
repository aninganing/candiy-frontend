import { useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/shared/lib/cn';

const inputVariants = cva(
  'w-full rounded-control border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'border-danger focus:ring-danger',
        false: 'border-border focus:ring-ring',
      },
      hasLeadingIcon: {
        true: 'pl-10',
      },
      hasTrailingIcon: {
        true: 'pr-10',
      },
    },
    defaultVariants: { error: false },
  },
);

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id?: string;
  label?: string;
  layout?: 'vertical' | 'horizontal';
  icon?: ReactNode;
  iconPosition?: 'leading' | 'trailing';
  helperText?: string;
  errorText?: string;
}

export function Input({
  id,
  label,
  layout = 'vertical',
  icon,
  iconPosition = 'leading',
  helperText,
  errorText,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hasError = Boolean(errorText);
  const isHorizontal = layout === 'horizontal';

  const labelEl = label ? (
    <label
      htmlFor={inputId}
      className={cn('text-foreground text-sm font-medium', isHorizontal && 'shrink-0')}
    >
      {label}
    </label>
  ) : null;

  const fieldEl = (
    <div className={cn('relative', isHorizontal && 'flex-1')}>
      {icon && iconPosition === 'leading' && (
        <span className="text-foreground-subtle pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
          {icon}
        </span>
      )}
      <input
        id={inputId}
        className={cn(
          inputVariants({
            error: hasError,
            hasLeadingIcon: Boolean(icon) && iconPosition === 'leading',
            hasTrailingIcon: Boolean(icon) && iconPosition === 'trailing',
          }),
          className,
        )}
        aria-invalid={hasError || undefined}
        {...props}
      />
      {icon && iconPosition === 'trailing' && (
        <span className="text-foreground-subtle pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
          {icon}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      {isHorizontal ? (
        <div className="flex items-center gap-3">
          {labelEl}
          {fieldEl}
        </div>
      ) : (
        <>
          {labelEl}
          {fieldEl}
        </>
      )}
      {(errorText ?? helperText) && (
        <span className={cn('text-xs', hasError ? 'text-danger' : 'text-foreground-subtle')}>
          {errorText ?? helperText}
        </span>
      )}
    </div>
  );
}
