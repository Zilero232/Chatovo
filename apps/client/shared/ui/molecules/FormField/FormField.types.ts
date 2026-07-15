import type { ReactNode } from 'react';

export type FormFieldProps = {
  htmlFor: string;
  label: ReactNode;
  children: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
};
