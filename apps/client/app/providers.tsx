'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { setLogLevel } from 'livekit-client';
import { RealtimeProvider } from '@/entities/app/realtime';
import { LeaveSoundProvider } from '@/entities/room/room';
import { FriendsRealtimeSync } from '@/entities/social/friend';
import { FriendChatProvider } from '@/features/social/friend-chat';
import { queryClient } from '@/shared/api';
import { isTauriDesktop } from '@/shared/lib';
import { Toaster, TooltipProvider } from '@/shared/ui';
import { TitleBar } from '@/widgets/app/title-bar';
import { ChatRealtimeSync } from '@/widgets/chat/chat-panel';
import {
  AuthProvider,
  DeepLinkProvider,
  I18nProvider,
  ShortcutsProvider,
  TauriDesktopDocumentClass,
  TauriMobileInsets,
  TrayMenuProvider,
  UpdateProvider,
} from './providers/index';
import type { ReactNode } from 'react';

setLogLevel('error');

export const Providers = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TauriMobileInsets />
      <TauriDesktopDocumentClass />
      <TooltipProvider>
        <div className="flex h-full flex-col">
          {isTauriDesktop() && <TitleBar />}

          <div className="min-h-0 flex-1">
            <TrayMenuProvider>
              <ShortcutsProvider>
                <UpdateProvider>
                  <DeepLinkProvider>
                    <AuthProvider>
                      <RealtimeProvider>
                        <FriendChatProvider>
                          <FriendsRealtimeSync />
                          <ChatRealtimeSync />
                          <LeaveSoundProvider>{children}</LeaveSoundProvider>
                        </FriendChatProvider>
                      </RealtimeProvider>
                    </AuthProvider>
                  </DeepLinkProvider>
                </UpdateProvider>
              </ShortcutsProvider>
            </TrayMenuProvider>
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
