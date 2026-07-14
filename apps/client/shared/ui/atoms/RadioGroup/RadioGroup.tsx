'use client';

import { clsx } from 'clsx';
import { RadioGroup as RACRadioGroup, Radio } from 'react-aria-components';
import s from './RadioGroup.module.scss';
import type { Key } from '@react-types/shared';
import type { RadioGroupItemProps, RadioGroupProps } from './RadioGroup.types';

const RadioGroup = ({ className, onValueChange, ...props }: RadioGroupProps) => (
  <RACRadioGroup
    className={clsx(s.root, className)}
    data-slot="radio-group"
    onChange={(value) => onValueChange?.(value as Key)}
    {...props}
  />
);

const RadioGroupItem = ({ className, ...props }: RadioGroupItemProps) => (
  <Radio className={clsx(s.item, className)} data-slot="radio-group-item" {...props}>
    {({ isSelected }) => (
      <span className={s.indicator}>{isSelected ? <span className={s.dot} /> : null}</span>
    )}
  </Radio>
);

export { RadioGroup, RadioGroupItem };
