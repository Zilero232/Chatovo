import type { Separator } from '@base-ui-components/react/separator';
import type { ComponentProps } from 'react';

export type SeparatorProps = Omit<ComponentProps<typeof Separator>, 'className'> & {
  className?: string;
  decorative?: boolean;
};
