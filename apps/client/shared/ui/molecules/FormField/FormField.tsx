import { clsx } from 'clsx';
import { Label } from '../../atoms';
import s from './FormField.module.scss';
import type { ReactNode } from 'react';

type FormFieldProps = {
  htmlFor: string;
  label: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
};

export const FormField = ({ htmlFor, label, children, hint, error, className }: FormFieldProps) => {
  return (
    <div className={clsx(s.root, className)}>
      <Label className={s.label} htmlFor={htmlFor}>
        {label}
      </Label>
      {children}
      {hint && <p className={s.hint}>{hint}</p>}
      {error && <p className={s.error}>{error}</p>}
    </div>
  );
};
