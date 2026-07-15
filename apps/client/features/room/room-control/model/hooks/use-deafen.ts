'use client';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { isNullish } from 'remeda';

import { useRealtime } from '@/entities/app/realtime';
import { useAppSettings } from '@/entities/app/settings';
import { toggleMicStream } from '@/shared/lib';
import { useDeafenContext } from '../contexts/deafen-context';

import type { LocalParticipant } from 'livekit-client';

export const useDeafen = () => {
  const room = useRoomContext();
  const { localParticipant } = useLocalParticipant();
  const { settings } = useAppSettings();
  const { send } = useRealtime();

  const { isDeafened, setIsDeafened, micBeforeDeafen } = useDeafenContext();

  const isPtt = settings.audio.activationMode === 'pushToTalk';

  const enableDeafen = async (p: LocalParticipant) => {
    micBeforeDeafen.current = p.isMicrophoneEnabled;

    await p.setMicrophoneEnabled(false);
  };

  const disableDeafen = async (p: LocalParticipant) => {
    if (!micBeforeDeafen.current) {
      return;
    }

    await p.setMicrophoneEnabled(true);

    if (isPtt) {
      toggleMicStream(p, false);
    }
  };

  const setDeafened = async (next: boolean) => {
    if (isNullish(localParticipant)) {
      return;
    }

    setIsDeafened(next);
    send({
      op: 'presence.patch',
      roomId: room.name,
      deafened: next,
    });

    try {
      await (next ? enableDeafen(localParticipant) : disableDeafen(localParticipant));
    } catch (err) {
      console.error('deafen toggle failed', err);
    }
  };

  return {
    isDeafened,
    toggle: () => setDeafened(!isDeafened),
    undeafen: () => setDeafened(false),
  };
};
