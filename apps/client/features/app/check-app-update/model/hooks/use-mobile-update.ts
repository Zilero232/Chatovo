'use client';

import { gt, valid } from 'semver';

import { useRelease } from '@/entities/app/release';
import { env } from '@/shared/config';
import { isTauriMobile } from '@/shared/lib';

import type { MobileUpdate } from '../types';

export const useMobileUpdate = (): MobileUpdate => {
  const isMobile = isTauriMobile();
  const { data: release } = useRelease(isMobile);

  const current = valid(env.NEXT_PUBLIC_APP_VERSION);
  const latest = valid(release?.version ?? null);

  if (!isMobile || !current || !latest || !gt(latest, current)) {
    return { hasUpdate: false };
  }

  return {
    hasUpdate: true,
    version: latest,
    downloadUrl: release?.assets.android?.downloadUrl ?? null
  };
};
