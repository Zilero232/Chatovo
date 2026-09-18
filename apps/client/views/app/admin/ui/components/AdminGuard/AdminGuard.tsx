'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useCurrentUser } from '@/entities/auth/user';
import { ROUTES } from '@/shared/constants';
import { AppSplash } from '@/ui-kit';

import type { AdminGuardProps } from './AdminGuard.types';

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const router = useRouter();

  const { isAdmin, isLoading } = useCurrentUser();

  const isDenied = !isLoading && !isAdmin;

  useEffect(() => {
    if (isDenied) {
      router.replace(ROUTES.lobby);
    }
    // eslint-disable-next-line react/exhaustive-deps -- router is a stable ref; only the denial should trigger the redirect
  }, [isDenied]);

  if (isLoading || isDenied) {
    return <AppSplash />;
  }

  return children;
};
