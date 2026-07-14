'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useEffect } from 'react';

import { useLocale } from '@/entities/app/locale';
import { messages } from '@/shared/i18n';
import { AppSplash } from '@/shared/ui';

import type { ReactNode } from 'react';

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const { locale, isReady } = useLocale();

  useEffect(() => {
    if (isReady) {
      document.documentElement.lang = locale;
    }
  }, [locale, isReady]);

  if (!isReady) {
    return <AppSplash />;
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]}>
      {children}
    </NextIntlClientProvider>
  );
};
