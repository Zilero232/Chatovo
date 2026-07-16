'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { useState } from 'react';

import { DownloadAppDialog } from '@/features/app/download-app';
import { queryClient } from '@/shared/api';
import { messages } from '@/shared/i18n';
import { Button } from '@/shared/ui';

import type { LandingDownloadButtonProps } from './LandingDownloadButton.types';

export const LandingDownloadButton = ({ label, locale }: LandingDownloadButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="UTC">
        <Button size="lg" variant="outline" onClick={() => setIsOpen(true)}>
          {label}
        </Button>

        <DownloadAppDialog open={isOpen} onOpenChange={setIsOpen} />
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};
