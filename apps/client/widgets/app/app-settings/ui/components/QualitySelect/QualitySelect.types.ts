import type { SelectOption } from '@/shared/ui';

export type QualitySelectProps<T extends string> = {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
};
