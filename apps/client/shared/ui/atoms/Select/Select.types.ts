import type { ReactNode } from 'react';
import type { Key } from 'react-aria-components';

export type SelectOption<T extends string> = {
  value: T;
  label: string;
  icon?: ReactNode;
  isDisabled?: boolean;
};

export type SelectProps<T extends string> = {
  value: T | null;
  options: SelectOption<T>[];
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  menuClassName?: string;
  'aria-label'?: string;
  onChange: (value: T) => void;
};

export type SelectKey = Key;
