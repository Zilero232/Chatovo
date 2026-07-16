import type { Slider } from '@base-ui-components/react/slider';
import type { ComponentProps } from 'react';

export type SliderProps = Omit<
  ComponentProps<typeof Slider.Root>,
  'className' | 'onValueChange'
> & {
  className?: string;
  onValueChange?: (value: number | readonly number[]) => void;
};
