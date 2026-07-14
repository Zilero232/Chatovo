'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from '@/shared/api';
import { isTauriDesktop } from '@/shared/lib';
import { Toaster, TooltipProvider } from '@/shared/ui';
import { TitleBar } from '@/widgets/app/title-bar';
import {
  AuthProvider,
  I18nProvider,
  QueryFocusManager,
  TauriDesktopDocumentClass,
  TauriMobileInsets,
} from './providers/index';

import type { ReactNode } from 'react';

export const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <QueryFocusManager />
      <TauriMobileInsets />
      <TauriDesktopDocumentClass />
      <TooltipProvider>
        <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
          {isTauriDesktop() && <TitleBar />}

          <div style={{ minHeight: 0, flex: 1 }}>
            <AuthProvider>{children}</AuthProvider>
          </div>
        </div>
      </TooltipProvider>

      <Toaster />

      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools buttonPosition="bottom-right" />
      )}
    </I18nProvider>
  </QueryClientProvider>
);
