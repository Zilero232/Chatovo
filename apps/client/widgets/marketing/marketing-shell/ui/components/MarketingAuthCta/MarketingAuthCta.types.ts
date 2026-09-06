import type { ComponentProps, MouseEvent } from 'react';

import type { Button } from '@/ui-kit';

export type MarketingAuthCtaProps = {
  signInLabel: string;
  openAppLabel: string;
  className?: string;
  size?: ComponentProps<typeof Button>['size'];
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};
