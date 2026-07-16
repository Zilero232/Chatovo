'use client';

import { Switch as BaseSwitch } from '@base-ui-components/react/switch';
import { clsx } from 'clsx';

import s from './Switch.module.scss';

import type { SwitchProps } from './Switch.types';

const Switch = ({ className, checked, onCheckedChange, children, ...props }: SwitchProps) => (
  <BaseSwitch.Root
    checked={checked}
    className={clsx(s.root, className)}
    data-slot="switch"
    onCheckedChange={onCheckedChange}
    {...props}
  >
    <BaseSwitch.Thumb className={s.thumb} data-slot="switch-thumb" />
    {children}
  </BaseSwitch.Root>
);

export { Switch };
