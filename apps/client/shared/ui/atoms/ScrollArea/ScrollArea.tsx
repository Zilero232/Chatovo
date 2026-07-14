'use client';

import { clsx } from 'clsx';
import s from './ScrollArea.module.scss';
import type { ScrollAreaProps, ScrollBarProps } from './ScrollArea.types';

const ScrollArea = ({ className, children, ...props }: ScrollAreaProps) => (
  <div className={clsx('scrollbar-thin', s.root, className)} data-slot="scroll-area" {...props}>
    <div className={s.viewport} data-slot="scroll-area-viewport">
      {children}
    </div>
  </div>
);

const ScrollBar = ({ className, orientation = 'vertical', ...props }: ScrollBarProps) => (
  <div
    className={clsx(s.scrollbar, className)}
    data-orientation={orientation}
    data-slot="scroll-area-scrollbar"
    {...props}
  />
);

export { ScrollArea, ScrollBar };
