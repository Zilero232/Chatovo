'use client';

import { clsx } from 'clsx';

import s from './Label.module.scss';

import type { LabelProps } from './Label.types';

const Label = ({ className, ...props }: LabelProps) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor is supplied by consumers through props
  <label className={clsx(s.root, className)} data-slot="label" {...props} />
);

export { Label };
