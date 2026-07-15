import type { SelectOption } from '@/shared/ui';

export type QualitySelectProps<T extends string> = {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
};
