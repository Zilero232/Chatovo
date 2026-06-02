'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { match } from 'ts-pattern';
import { useCurrentUser } from '@/entities/auth/user';
import { useOttReturn } from '@/features/auth/google';
import { ROUTES } from '@/shared/constants';
import { AppSplash } from '@/shared/ui';
import type { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('splash');
  const router = useRouter();
  const pathname = usePathname();

  useOttReturn();

  const { isLoading, isAuthenticated } = useCurrentUser();

  const isGuestZone = pathname === ROUTES.auth;

  const target = match({ isGuestZone, isLoading, isAuthenticated })
    .with({ isLoading: true }, () => null)
    .with({ isGuestZone: true, isAuthenticated: true }, () => ROUTES.lobby)
    .with({ isGuestZone: false, isAuthenticated: false }, () => ROUTES.auth)
    .otherwise(() => null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on target change; router is a stable ref
  useEffect(() => {
    if (target) {
      router.replace(target);
    }
  }, [target]);

  if (isLoading || target) {
    return <AppSplash message={t('signingIn')} />;
  }

  return children;
};
