'use client';

import { useCurrentUser } from '@/entities/auth/user';
import { ROUTES } from '@/shared/constants';
import { Button } from '@/ui-kit';

import type { LandingAuthCtaProps } from './LandingAuthCta.types';

export const LandingAuthCta = ({
  signInLabel,
  openAppLabel,
  className,
  size = 'sm'
}: LandingAuthCtaProps) => {
  const { isAuthenticated, isLoading } = useCurrentUser();

  const isSignedIn = !isLoading && isAuthenticated;

  return (
    <Button className={className} href={isSignedIn ? ROUTES.lobby : ROUTES.auth} size={size}>
      {isSignedIn ? openAppLabel : signInLabel}
    </Button>
  );
};
