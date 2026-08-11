'use client';

import type { ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { MotionConfig } from 'motion/react';

import { queryClient } from '@/shared/api';
import { isTauriDesktop } from '@/shared/lib';
import { Toaster, TooltipProvider } from '@/shared/ui';
import { TitleBar } from '@/widgets/app/title-bar';

import { AuthProvider } from './AuthProvider';
import { I18nProvider } from './I18nProvider';
import { QueryFocusManager } from './QueryFocusManager';
import { TauriDesktopDocumentClass } from './TauriDesktopDocumentClass';
import { TauriMobileInsets } from './TauriMobileInsets';

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <QueryFocusManager />
      <TauriMobileInsets />
      <TauriDesktopDocumentClass />
      <MotionConfig reducedMotion='user'>
        <TooltipProvider>
          <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
            {isTauriDesktop() && <TitleBar />}

            <div style={{ minHeight: 0, flex: 1 }}>
              <AuthProvider>{children}</AuthProvider>
            </div>
          </div>
        </TooltipProvider>
      </MotionConfig>

      <Toaster />

      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools buttonPosition='bottom-right' />
      )}
    </I18nProvider>
  </QueryClientProvider>
);
