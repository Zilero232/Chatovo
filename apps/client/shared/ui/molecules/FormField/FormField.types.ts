import type { ReactNode } from 'react';

export type FormFieldProps = {
  children: ReactNode;
  className?: string;
  error?: ReactNode;
  hint?: ReactNode;
  htmlFor: string;
  label: ReactNode;
};
