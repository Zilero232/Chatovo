'use client';

import { Select } from '@/shared/ui';

import type { SelectOption } from '@/shared/ui';

type QualitySelectProps<T extends string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
};

export const QualitySelect = <T extends string>({
  value,
  options,
  onChange,
}: QualitySelectProps<T>) => <Select options={options} value={value} onChange={onChange} />;
