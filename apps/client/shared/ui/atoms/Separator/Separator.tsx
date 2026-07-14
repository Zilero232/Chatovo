'use client';

import { clsx } from 'clsx';
import { Separator as RACSeparator } from 'react-aria-components';

import s from './Separator.module.scss';

import type { SeparatorProps } from './Separator.types';

const Separator = ({
  className,
  orientation = 'horizontal',
  decorative: _decorative,
  ...props
}: SeparatorProps) => (
  <RACSeparator
    className={clsx(s.root, className)}
    data-slot="separator"
    orientation={orientation}
    {...props}
  />
);

export { Separator };
