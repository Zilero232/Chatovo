import type { ReactNode } from 'react';

export type LandingRevealProps = {
  as?: 'article' | 'div' | 'li' | 'section';
  children: ReactNode;
  className?: string;
  delay?: number;
};
