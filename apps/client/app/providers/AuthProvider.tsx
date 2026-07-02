'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { match } from 'ts-pattern';
import { useCurrentUser } from '@/entities/auth/user';
import { isPublicRoute, ROUTES } from '@/shared/constants';
import { AppSplash } from '@/shared/ui';
import type { ReactNode } from 'react';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('splash');
  const router = useRouter();
  const pathname = usePathname();

  const { isLoading, isAuthenticated } = useCurrentUser();

  const hasResolvedRef = useRef(false);

  if (!isLoading) {
    hasResolvedRef.current = true;
  }

  const isInitialLoading = isLoading && !hasResolvedRef.current;

  const isGuestZone = isPublicRoute(pathname);

  const target = match({ isGuestZone, isInitialLoading, isAuthenticated })
    .with({ isInitialLoading: true }, () => null)
    .with({ isGuestZone: true, isAuthenticated: true }, () => ROUTES.lobby)
    .with({ isGuestZone: false, isAuthenticated: false }, () => ROUTES.auth)
    .otherwise(() => null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on target change; router is a stable ref
  useEffect(() => {
    if (target) {
      router.replace(target);
    }
  }, [target]);

  if (isInitialLoading || target) {
    return <AppSplash message={t('signingIn')} />;
  }

  return children;
};
