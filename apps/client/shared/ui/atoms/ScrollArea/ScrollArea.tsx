'use client';

import { clsx } from 'clsx';

import type { ScrollAreaProps } from './ScrollArea.types';

import s from './ScrollArea.module.scss';

const ScrollArea = ({ className, children, ...props }: ScrollAreaProps) => (
  <div className={clsx('scrollbar-thin', s.root, className)} data-slot='scroll-area' {...props}>
    <div className={s.viewport} data-slot='scroll-area-viewport'>
      {children}
    </div>
  </div>
);

export { ScrollArea };
