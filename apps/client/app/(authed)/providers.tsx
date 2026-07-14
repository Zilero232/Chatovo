'use client';

import { RealtimeProvider } from '@/entities/app/realtime';
import { LeaveSoundProvider } from '@/entities/room/room';
import { FriendsRealtimeSync } from '@/entities/social/friend';
import { PushRegistration } from '@/features/app/push-notifications';
import { FriendChatProvider } from '@/features/social/friend-chat';
import { ChatRealtimeSync } from '@/widgets/chat/chat-panel';
import {
  DeepLinkProvider,
  ShortcutsProvider,
  TrayMenuProvider,
  UpdateProvider,
} from '../providers/index';

import type { ReactNode } from 'react';

export const AuthedProviders = ({ children }: { children: ReactNode }) => (
  <TrayMenuProvider>
    <ShortcutsProvider>
      <UpdateProvider>
        <DeepLinkProvider>
          <RealtimeProvider>
            <FriendChatProvider>
              <PushRegistration />
              <FriendsRealtimeSync />
              <ChatRealtimeSync />
              <LeaveSoundProvider>{children}</LeaveSoundProvider>
            </FriendChatProvider>
          </RealtimeProvider>
        </DeepLinkProvider>
      </UpdateProvider>
    </ShortcutsProvider>
  </TrayMenuProvider>
);
