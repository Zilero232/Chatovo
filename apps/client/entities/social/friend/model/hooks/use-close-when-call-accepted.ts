'use client';

import { useEffect, useEffectEvent } from 'react';

import { useOutgoingFriendCall } from './use-outgoing-friend-call';

export const useCloseWhenCallAccepted = (close: () => void) => {
  const { data } = useOutgoingFriendCall();
  const status = data?.call?.status ?? null;
  const onClose = useEffectEvent(close);

  useEffect(() => {
    if (status === 'accepted') {
      onClose();
    }
  }, [status]);
};
