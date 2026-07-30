import type { ReactNode } from 'react';

export type SelectOption<T extends string> = {
  icon?: ReactNode;
  isDisabled?: boolean;
  label: string;
  value: T;
};

export type SelectProps<T extends string> = {
  'aria-label'?: string;
  className?: string;
  isDisabled?: boolean;
  menuClassName?: string;
  options: SelectOption<T>[];
  placeholder?: string;
  value: T | null;
  onChange: (value: T) => void;
};
