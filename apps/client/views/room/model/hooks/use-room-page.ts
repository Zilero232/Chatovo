'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  const { session, open } = useRoomSession();

  const [passwordByRoom, setPasswordByRoom] = useState<Record<string, string>>({});

  const roomId = params.get('id');
  const titleOverride = params.get('title');
  const isChatOpen = params.get('view') === 'chat';
  const password = roomId ? passwordByRoom[roomId] : undefined;
  const isSessionOpen = session?.roomId === roomId;

  const { room, isLoading, displayName, isPrivate, isDm } = useRoomById(roomId);

  const {
    data: token,
    isError: tokenFailed,
    isFetching: tokenFetching,
    error: tokenError,
    refetch: refetchToken
  } = useRoomToken(isNonNullish(room) && !isSessionOpen ? roomId : null, { isPrivate, password });

  const isInvisible = isAdmin && settings.system.invisibleMode;
  const roomTitle = titleOverride ?? displayName;

  useEffect(() => {
    if (!roomId) {
      router.replace(ROUTES.lobby);
    }
    // eslint-disable-next-line react/exhaustive-deps -- redirect must fire only on roomId change; router is a stable ref
  }, [roomId]);

  useEffect(() => {
    if (!isPrivate && tokenFailed) {
      router.replace(ROUTES.lobby);
    }
    // eslint-disable-next-line react/exhaustive-deps -- redirect must fire only when a public-room token fetch fails; router is a stable ref
  }, [isPrivate, tokenFailed]);

  useEffect(() => {
    if (isNonNullish(roomId) && isNonNullish(token)) {
      open({
        roomId,
        roomName: roomTitle,
        token,
        isChatOpen,
        isDm,
        isPrivate,
        isInvisible,
        password
      });
    }
    // eslint-disable-next-line react/exhaustive-deps -- opening is driven by a fresh token; open is stable and roomTitle must not reopen the session
  }, [roomId, token, isChatOpen, isDm, isPrivate, isInvisible, password]);

  const submitPassword = (value: string) => {
    if (!roomId) {
      return;
    }

    if (value === password) {
      return refetchToken();
    }

    setPasswordByRoom((current) => ({ ...current, [roomId]: value }));
  };

  return {
    isDm,
    isLoading,
    isPrivate,
    isSessionOpen,
    room,
    roomId,
    roomTitle,
    submitPassword,
    tokenError,
    tokenFailed,
    tokenFetching
  };
};
