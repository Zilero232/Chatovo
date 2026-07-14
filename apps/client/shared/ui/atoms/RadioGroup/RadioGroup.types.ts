import type { Key } from '@react-types/shared';
import type { RadioGroupProps as RACRadioGroupProps, RadioProps } from 'react-aria-components';

export type RadioGroupProps = RACRadioGroupProps & {
  onValueChange?: (value: Key) => void;
};

export type RadioGroupItemProps = RadioProps;
