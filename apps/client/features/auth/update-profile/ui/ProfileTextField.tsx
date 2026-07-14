'use client';

import { Input, Label, Textarea } from '@/shared/ui';

import s from './UpdateProfileForm.module.scss';

import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type ProfileTextFieldProps = {
  id: string;
  label: string;
  hint: ReactNode;
  error?: ReactNode;
  registration: UseFormRegisterReturn;
  autoComplete?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  rows?: number;
  multiline?: boolean;
};

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
    <div className={s.field}>
      <Label className={s.label} htmlFor={id}>
        {label}
      </Label>

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

      {error ? <p className={s.error}>{error}</p> : <p className={s.hint}>{hint}</p>}
    </div>
  );
};
