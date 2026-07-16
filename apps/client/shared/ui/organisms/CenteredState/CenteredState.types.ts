import type { ReactNode } from 'react';
import type { CenteredStateVariantProps } from './CenteredState.variants';

export type CenteredStateSize = NonNullable<CenteredStateVariantProps['size']>;

export type CenteredStateProps = {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  size?: CenteredStateSize;
  className?: string;
};
