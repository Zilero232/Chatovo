'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useEffect } from 'react';

import { useLocale } from '@/entities/app/locale';
import { DEFAULT_LOCALE, messages } from '@/shared/i18n';
import { AppSplash } from '@/shared/ui';

import type { ReactNode } from 'react';

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { locale, isReady } = useLocale();
  const activeLocale = isReady ? locale : DEFAULT_LOCALE;

  useEffect(() => {
    if (isReady) {
      document.documentElement.lang = locale;
    }
  }, [locale, isReady]);

  return (
    <NextIntlClientProvider locale={activeLocale} messages={messages[activeLocale]}>
      {!isReady ? <AppSplash /> : children}
    </NextIntlClientProvider>
  );
};
