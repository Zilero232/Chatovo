'use client';

import { useCurrentUser } from '@/entities/auth/user';
import { ROUTES } from '@/shared/constants';
import { buildAppHref } from '@/shared/lib';
import { Button } from '@/ui-kit';

import type { MarketingAuthCtaProps } from './MarketingAuthCta.types';

export const MarketingAuthCta = ({
  signInLabel,
  openAppLabel,
  className,
  size = 'sm',
  onClick
}: MarketingAuthCtaProps) => {
  const { isAuthenticated, isLoading } = useCurrentUser();

  const isSignedIn = !isLoading && isAuthenticated;

  return (
    <Button
      className={className}
      href={buildAppHref(isSignedIn ? ROUTES.lobby : ROUTES.auth)}
      size={size}
      onClick={onClick}
    >
      {isSignedIn ? openAppLabel : signInLabel}
    </Button>
  );
};
