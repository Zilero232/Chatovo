import type { SelectOption } from '@/ui-kit';

export type QualitySelectProps<T extends string> = {
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
};
