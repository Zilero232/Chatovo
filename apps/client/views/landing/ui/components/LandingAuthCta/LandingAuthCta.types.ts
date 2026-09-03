import type { ComponentProps } from 'react';

import type { Button } from '@/ui-kit';

export type LandingAuthCtaProps = {
  signInLabel: string;
  openAppLabel: string;
  className?: string;
  size?: ComponentProps<typeof Button>['size'];
};
