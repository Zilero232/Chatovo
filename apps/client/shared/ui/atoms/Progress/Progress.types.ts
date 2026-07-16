import type { Progress } from '@base-ui-components/react/progress';
import type { ComponentProps } from 'react';

export type ProgressProps = Omit<ComponentProps<typeof Progress.Root>, 'className'> & {
  className?: string;
};
