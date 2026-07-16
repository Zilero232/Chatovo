'use client';

import { FormField, Input, Textarea } from '@/shared/ui';

import type { ProfileTextFieldProps } from './ProfileTextField.types';

export const ProfileTextField = ({
  id,
  label,
  hint,
  error,
  registration,
  autoComplete,
  placeholder,
  type,
  rows,
  multiline,
}: ProfileTextFieldProps) => {
  return (
    <FormField htmlFor={id} label={label} hint={error ? undefined : hint} error={error}>
      {multiline ? (
        <Textarea id={id} placeholder={placeholder} rows={rows} {...registration} />
      ) : (
        <Input
          autoComplete={autoComplete}
          id={id}
          placeholder={placeholder}
          type={type}
          {...registration}
        />
      )}
    </FormField>
  );
};
