'use client';

import { clsx } from 'clsx';
import { ProgressBar } from 'react-aria-components';
import s from './Progress.module.scss';
import type { ProgressProps } from './Progress.types';

const Progress = ({ className, value, ...props }: ProgressProps) => (
  <ProgressBar className={clsx(s.root, className)} data-slot="progress" value={value} {...props}>
    {({ percentage = 0 }) => (
      <div className={s.track}>
        <div
          className={s.indicator}
          data-slot="progress-indicator"
          style={{ transform: `translateX(-${100 - percentage}%)` }}
        />
      </div>
    )}
  </ProgressBar>
);

export { Progress };
