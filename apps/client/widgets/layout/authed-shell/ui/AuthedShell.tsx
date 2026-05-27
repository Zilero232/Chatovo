'use client';

import { useBoolean } from '@siberiacancode/reactuse';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useCurrentUser } from '@/entities/auth/user';
import { ROUTES } from '@/shared/constants';
import { AppSidebar } from '@/widgets/app/app-sidebar';
import { MobileNav } from '@/widgets/layout/mobile-nav';
import { ChannelsPanel } from '@/widgets/room/channels-panel';
import { authedShellStyles as s } from './AuthedShell.styles';
import type { AuthedShellProps } from './AuthedShell.types';

export const AuthedShell = ({ children }: AuthedShellProps) => {
  const router = useRouter();

  const { session } = useCurrentUser();

  const [channelsOpened, toggleChannels] = useBoolean(true);
  const [mobileNavOpen, toggleMobileNav] = useBoolean(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: redirect must fire only on session change; router is a stable ref
  useEffect(() => {
    if (!session) router.replace(ROUTES.auth);
  }, [session]);

  if (!session) return null;

  return (
    <div className={s.root}>
      <MobileNav open={mobileNavOpen} onOpenChange={toggleMobileNav} />

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
  );
};
