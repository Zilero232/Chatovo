import type { ReactNode } from 'react';

export type BannerTone = 'accent' | 'default';

export type BannerProps = {
  title: ReactNode;
  description: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  tone?: BannerTone;
  className?: string;
};
