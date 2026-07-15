'use client';

import { clsx } from 'clsx';
import { Check, ChevronDown } from 'lucide-react';
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Select as RACSelect,
  SelectValue,
} from 'react-aria-components';
import { isNullish } from 'remeda';

import s from './Select.module.scss';

import type { SelectKey, SelectProps } from './Select.types';

export const Select = <T extends string>({
  value,
  options,
  placeholder,
  isDisabled,
  className,
  menuClassName,
  'aria-label': ariaLabel,
  onChange,
}: SelectProps<T>) => {
  const handleChange = (key: SelectKey | null) => {
    if (isNullish(key)) {
      return;
    }

    onChange(String(key) as T);
  };

  return (
    <RACSelect
      aria-label={ariaLabel}
      className={clsx(s.root, className)}
      data-slot="select"
      isDisabled={isDisabled}
      value={value}
      onChange={handleChange}
    >
      <Button className={s.trigger} data-slot="select-trigger">
        <SelectValue className={s.value}>
          {({ isPlaceholder, selectedText }) => (isPlaceholder ? placeholder : selectedText)}
        </SelectValue>
        <ChevronDown aria-hidden className={s.chevron} />
      </Button>

      <Popover className={clsx('glass-overlay', s.popup, menuClassName)}>
        <ListBox className={s.list} items={options}>
          {(option) => (
            <ListBoxItem
              key={option.value}
              className={s.item}
              id={option.value}
              isDisabled={option.isDisabled}
              textValue={option.label}
            >
              {option.icon}
              <span className={s.itemLabel}>{option.label}</span>
              <Check aria-hidden className={s.check} />
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </RACSelect>
  );
};
