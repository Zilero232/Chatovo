'use client';

import { Separator as BaseSeparator } from '@base-ui-components/react/separator';
import { clsx } from 'clsx';

import s from './Separator.module.scss';

import type { SeparatorProps } from './Separator.types';

const Separator = ({
  className,
  orientation = 'horizontal',
  decorative: _decorative,
  ...props
}: SeparatorProps) => (
  <BaseSeparator
    className={clsx(s.root, className)}
    data-slot="separator"
    orientation={orientation}
    {...props}
  />
);

export { Separator };
