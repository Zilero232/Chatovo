import { cn } from '@/shared/lib/cn';
import { Label } from '@/shared/ui/atoms';
import type { ReactNode } from 'react';

type FormFieldProps = {
  // Visible label text + the htmlFor target id.
  htmlFor: string;
  label: ReactNode;
  // Wraps the input element so consumers stay free to pass any Input / textarea
  // / select shape; only the label + error chrome is standardised.
  children: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
};

export const FormField = ({ htmlFor, label, children, hint, error, className }: FormFieldProps) => {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label
        className="text-xs font-medium tracking-wide text-foreground/70 uppercase"
        htmlFor={htmlFor}
      >
        {label}
      </Label>
      {children}
      {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  );
};
