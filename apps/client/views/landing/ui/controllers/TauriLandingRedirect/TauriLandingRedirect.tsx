'use client';

import { isTauri } from '@tauri-apps/api/core';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ROUTES } from '@/shared/constants';

export const TauriLandingRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    if (isTauri()) {
      router.replace(ROUTES.lobby);
    }
  }, [router]);

  return null;
};
