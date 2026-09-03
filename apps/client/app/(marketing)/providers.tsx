'use client';

import type { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { usePathname } from 'next/navigation';

import { queryClient } from '@/shared/api';
import { messages, resolveLocaleFromPath } from '@/shared/i18n';

export const MarketingProviders = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const locale = resolveLocaleFromPath(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone='UTC'>
        {children}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};
