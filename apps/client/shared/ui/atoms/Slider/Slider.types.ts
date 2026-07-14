import type { SliderProps as RACSliderProps } from 'react-aria-components';

export type SliderProps = RACSliderProps & {
  max?: number;
  min?: number;
  onValueChange?: (value: number | number[]) => void;
};
