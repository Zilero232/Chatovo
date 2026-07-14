'use client';

import { clsx } from 'clsx';
import { Label as RACLabel } from 'react-aria-components';

import s from './Label.module.scss';

import type { LabelProps } from './Label.types';

const Label = ({ className, ...props }: LabelProps) => (
  <RACLabel className={clsx(s.root, className)} data-slot="label" {...props} />
);

export { Label };
