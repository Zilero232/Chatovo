import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';
import s from './Spinner.module.scss';
import type { SpinnerProps, SpinnerSize } from './Spinner.types';

const sizeClass: Record<SpinnerSize, string> = {
  xs: s.sizeXs,
  sm: s.sizeSm,
  md: s.sizeMd,
  lg: s.sizeLg,
  xl: s.sizeXl,
};

export const Spinner = ({ className, size = 'sm', ...props }: SpinnerProps) => (
  <Loader2 className={clsx(s.root, sizeClass[size], className)} {...props} />
);
