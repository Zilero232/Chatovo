'use client';

import { ChevronDownIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/ui';
import { appSettingsStyles as s } from '../AppSettingsButton.styles';

type QualityOption<T extends string> = {
  value: T;
  label: string;
};

type QualitySelectProps<T extends string> = {
  value: T;
  options: QualityOption<T>[];
  onChange: (value: T) => void;
};

export const QualitySelect = <T extends string>({
  value,
  options,
  onChange,
}: QualitySelectProps<T>) => {
  const active = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={s.deviceTrigger}>
        <span className={s.deviceTriggerLabel}>{active?.label ?? value}</span>
        <ChevronDownIcon className="size-4 shrink-0 opacity-60" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className={s.deviceMenu}>
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(next as T)}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
