import { clsx } from 'clsx';

import s from './Input.module.scss';

import type { InputProps } from './Input.types';

const Input = ({ className, type, ...props }: InputProps) => (
  <input className={clsx(s.root, className)} data-slot="input" type={type} {...props} />
);

export { Input };
