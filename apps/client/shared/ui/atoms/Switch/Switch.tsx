'use client';

import { clsx } from 'clsx';
import { Switch as RACSwitch } from 'react-aria-components';

import s from './Switch.module.scss';

import type { SwitchProps } from './Switch.types';

const Switch = ({
  className,
  checked,
  onCheckedChange,
  isSelected,
  onChange,
  children,
  ...props
}: SwitchProps) => (
  <RACSwitch
    className={clsx(s.root, className)}
    data-slot="switch"
    isSelected={isSelected ?? checked}
    onChange={(value) => {
      onChange?.(value);
      onCheckedChange?.(value);
    }}
    {...props}
  >
    {(values) => (
      <>
        <span className={s.thumb} data-selected={values.isSelected} data-slot="switch-thumb" />
        {typeof children === 'function' ? children(values) : children}
      </>
    )}
  </RACSwitch>
);

export { Switch };
