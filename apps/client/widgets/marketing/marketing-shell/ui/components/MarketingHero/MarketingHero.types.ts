import type { ReactNode } from 'react';

export type MarketingHeroProps = {
  title: string;
  description: string;
  eyebrow?: string;
  children?: ReactNode;
};
