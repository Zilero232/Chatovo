'use client';

import { Input, Label, Textarea } from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';
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
    <div className={s.profileField}>
      <Label className={s.profileLabel} htmlFor={id}>
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

      {error ? <p className={s.profileError}>{error}</p> : <p className={s.profileHint}>{hint}</p>}
    </div>
  );
};
