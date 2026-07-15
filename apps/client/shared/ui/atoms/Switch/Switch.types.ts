import type { SwitchProps as RACSwitchProps } from 'react-aria-components';

export type SwitchProps = RACSwitchProps & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};
