import { clsx } from 'clsx';
import { useId } from 'react';

import { Label, Text } from '../../atoms';

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
        <Text id={hintId} size="xs" tone="muted">
          {hint}
        </Text>
      )}
      {error && (
        <Text id={errorId} role="alert" size="xs" tone="destructive">
          {error}
        </Text>
      )}
    </div>
  );
};
