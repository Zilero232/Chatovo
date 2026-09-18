'use client';

import { useEffect } from 'react';
import { isNonNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomToken } from '@/entities/room/room';
import { useRoomSession } from '@/entities/room/session';

/** Reissues the LiveKit token when invisible mode flips, so the session rejoins hidden or visible. */
export const useInvisibleModeSync = () => {
  const { isAdmin } = useCurrentUser();
  const { settings } = useAppSettings();
  const { session, open } = useRoomSession();

  const invisible = isAdmin && settings.system.invisibleMode;
  const isStale = isNonNullish(session) && session.isInvisible !== invisible;

  const { data: token } = useRoomToken(isStale ? session.roomId : null);

  useEffect(() => {
    if (isNonNullish(session) && isNonNullish(token) && isStale) {
      open({ ...session, token, isInvisible: invisible });
    }
    // eslint-disable-next-line react/exhaustive-deps -- reopen only on a fresh token for a stale session; open is stable
  }, [token, isStale, invisible]);
};
