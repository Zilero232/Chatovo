'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { isNonNullish } from 'remeda';

import { useAppSettings } from '@/entities/app/settings';
import { useCurrentUser } from '@/entities/auth/user';
import { useRoomById, useRoomToken } from '@/entities/room/room';
import { useRoomSession } from '@/entities/room/session';
import { ROUTES } from '@/shared/constants';

export const useRoomPage = () => {
  const router = useRouter();
  const params = useSearchParams();

  const { settings } = useAppSettings();
  const { isAdmin } = useCurrentUser();
  const { session, open, isRecentlyLeft, rejoin } = useRoomSession();

  const roomId = params.get('id');
  const titleOverride = params.get('title');
  const isChatOpen = params.get('view') === 'chat';
  const isSessionOpen = session?.roomId === roomId;

  const { room, isLoading, displayName, isDm } = useRoomById(roomId);

  const {
    data: token,
    isError: tokenFailed,
    isFetching: tokenFetching
  } = useRoomToken(isNonNullish(room) && !isSessionOpen ? roomId : null);

  const isInvisible = isAdmin && settings.system.invisibleMode;
  const roomTitle = titleOverride ?? displayName;

  useEffect(() => {
    if (!roomId) {
      router.replace(ROUTES.lobby);
    }
    // eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on roomId change; router is a stable ref
  }, [roomId]);

  useEffect(() => {
    if (tokenFailed) {
      router.replace(ROUTES.lobby);
    }
    // eslint-disable-next-line react/exhaustive-deps -- redirect only when the token fetch fails; router is a stable ref
  }, [tokenFailed]);

  useEffect(
    () => () => {
      rejoin();
    },
    // eslint-disable-next-line react/exhaustive-deps -- the leave guard is lifted once the room route is gone; rejoin is stable
    []
  );

  useEffect(() => {
    if (isNonNullish(roomId) && isNonNullish(token) && !isRecentlyLeft(roomId)) {
      open({
        roomId,
        roomName: roomTitle,
        token,
        isChatOpen,
        isDm,
        isInvisible,
        serverId: room?.serverId ?? null
      });
    }
    // eslint-disable-next-line react/exhaustive-deps -- opening is driven by a fresh token; open is stable and roomTitle must not reopen the session
  }, [roomId, token, isChatOpen, isDm, isInvisible]);

  return {
    isDm,
    isLoading,
    isSessionOpen,
    room,
    roomId,
    roomTitle,
    tokenFailed,
    tokenFetching
  };
};
