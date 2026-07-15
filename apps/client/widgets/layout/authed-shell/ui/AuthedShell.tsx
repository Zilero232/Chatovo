'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

import { AppSidebar } from '@/widgets/app/app-sidebar';
import { MobileNav } from '@/widgets/layout/mobile-nav';
import { ChannelsPanel } from '@/widgets/room/channels-panel';
import { IncomingCallDialog } from '@/widgets/social/incoming-call-dialog';
import { OutgoingCallDialog } from '@/widgets/social/outgoing-call-dialog';

const FriendChatDialog = dynamic(
  () =>
    import('@/widgets/social/friend-chat-dialog').then((m) => ({ default: m.FriendChatDialog })),
  { ssr: false },
);

import s from './AuthedShell.module.scss';

import type { AuthedShellProps } from './AuthedShell.types';

export const AuthedShell = ({ children }: AuthedShellProps) => {
  const [channelsOpened, toggleChannels] = useBoolean(true);
  const [mobileNavOpen, toggleMobileNav] = useBoolean(false);

  return (
    <div className={s.root}>
      <MobileNav open={mobileNavOpen} onOpenChange={toggleMobileNav} />
      <IncomingCallDialog />
      <OutgoingCallDialog />
      <FriendChatDialog />

      <div className={s.shell}>
        <div className={s.desktopOnly}>
          <AppSidebar channelsOpened={channelsOpened} onToggleChannels={() => toggleChannels()} />
        </div>

        {channelsOpened && (
          <div className={s.desktopOnly}>
            <Suspense fallback={null}>
              <ChannelsPanel />
            </Suspense>
          </div>
        )}

        <div className={s.content}>{children}</div>
      </div>
    </div>
  );
};
