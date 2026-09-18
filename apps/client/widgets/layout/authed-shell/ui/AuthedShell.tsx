'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';

import { ROUTES } from '@/shared/constants';
import { MobileNav } from '@/widgets/layout/mobile-nav';
import { ChannelsPanel } from '@/widgets/room/channels-panel';
import { RoomSessionHost } from '@/widgets/room/room-session-host';
import { ServerChannelsPanel } from '@/widgets/server/server-channels-panel';
import { ServerRail } from '@/widgets/server/server-rail';
import { IncomingCallDialog } from '@/widgets/social/incoming-call-dialog';
import { OutgoingCallDialog } from '@/widgets/social/outgoing-call-dialog';

import type { AuthedShellProps } from './AuthedShell.types';

import s from './AuthedShell.module.scss';

export const AuthedShell = ({ children }: AuthedShellProps) => {
  const pathname = usePathname();

  const [mobileNavOpen, toggleMobileNav] = useBoolean(false);

  const isServerRoute = pathname === ROUTES.server;

  return (
    <div className={s.root}>
      <MobileNav open={mobileNavOpen} onOpenChange={toggleMobileNav} />
      <IncomingCallDialog />
      <OutgoingCallDialog />

      <div className={s.shell}>
        <div className={s.desktopOnly}>
          <Suspense fallback={null}>
            <ServerRail />
          </Suspense>
        </div>

        <div className={s.desktopOnly}>
          <Suspense fallback={null}>
            {isServerRoute ? <ServerChannelsPanel /> : <ChannelsPanel />}
          </Suspense>
        </div>

        <div className={s.content}>
          <div className={s.page}>{children}</div>
          <RoomSessionHost />
        </div>
      </div>
    </div>
  );
};
