'use client';

import type { ReactNode } from 'react';

import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { AppSplash } from '@/ui-kit';

import { useCheckAppUpdate } from '../model/hooks';
import { UpdateDialog } from './UpdateDialog';

export const UpdateBootstrap = ({ children }: { children: ReactNode }) => {
  const t = useTranslations('update');
  const { install, dismiss, ...info } = useCheckAppUpdate();

  const { status, silent, progress } = info;

  if (silent) {
    return match(status)
      .with('checking', () => <AppSplash message={t('checking')} />)
      .with('available', () => <AppSplash message={t('checking')} />)
      .with('downloading', () => (
        <AppSplash message={t('downloading', { percent: progress })} progress={progress} />
      ))
      .with('installing', () => <AppSplash message={t('installing')} progress={100} />)
      .with('error', () => <AppSplash message={t('failed')} />)
      .with('idle', 'unavailable', () => <>{children}</>)
      .exhaustive();
  }

  return match(status)
    .with('checking', () => <AppSplash message={t('checking')} />)
    .with('available', 'downloading', 'installing', 'error', () => (
      <>
        {children}
        <UpdateDialog {...info} onDismiss={dismiss} onInstall={install} />
      </>
    ))
    .with('idle', 'unavailable', () => <>{children}</>)
    .exhaustive();
};
