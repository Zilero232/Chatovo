import { clsx } from 'clsx';
import { useId } from 'react';

import { Label } from '../../atoms';

import s from './FormField.module.scss';

import type { FormFieldProps } from './FormField.types';

export const FormField = ({ htmlFor, label, children, hint, error, className }: FormFieldProps) => {
  const hintId = useId();
  const errorId = useId();

  return (
    <div className={clsx(s.root, className)}>
      <Label className={s.label} htmlFor={htmlFor}>
        {label}
      </Label>
      {children}
      {hint && (
        <p className={s.hint} id={hintId}>
          {hint}
        </p>
      )}
      {error && (
        <p className={s.error} id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
