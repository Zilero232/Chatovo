import type { Switch } from '@base-ui-components/react/switch';
import type { ComponentProps, ReactNode } from 'react';

export type SwitchProps = Omit<
  ComponentProps<typeof Switch.Root>,
  'className' | 'children' | 'onCheckedChange'
> & {
  className?: string;
  children?: ReactNode;
  onCheckedChange?: (checked: boolean) => void;
};
