import type { HTMLInputTypeAttribute, ReactNode } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export type ProfileTextFieldProps = {
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
