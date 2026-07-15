import type { ReactNode } from 'react';

export type CenteredStateSize = 'sm' | 'md';

export type CenteredStateProps = {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  size?: CenteredStateSize;
  className?: string;
};
