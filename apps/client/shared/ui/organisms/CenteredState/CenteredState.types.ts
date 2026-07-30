import type { ReactNode } from 'react';

import type { CenteredStateVariantProps } from './CenteredState.variants';

export type CenteredStateSize = NonNullable<CenteredStateVariantProps['size']>;

export type CenteredStateProps = {
  action?: ReactNode;
  className?: string;
  description?: ReactNode;
  icon?: ReactNode;
  size?: CenteredStateSize;
  title: ReactNode;
};
