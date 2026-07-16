'use client';

import { Progress as BaseProgress } from '@base-ui-components/react/progress';
import { clsx } from 'clsx';

import s from './Progress.module.scss';

import type { ProgressProps } from './Progress.types';

const Progress = ({ className, value, ...props }: ProgressProps) => (
  <BaseProgress.Root data-slot="progress" value={value} {...props}>
    <BaseProgress.Track className={clsx(s.root, className)}>
      <BaseProgress.Indicator className={s.indicator} data-slot="progress-indicator" />
    </BaseProgress.Track>
  </BaseProgress.Root>
);

export { Progress };
