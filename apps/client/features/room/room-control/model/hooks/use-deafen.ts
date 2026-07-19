'use client';

import { useLocalParticipant, useRoomContext } from '@livekit/components-react';
import { isNullish } from 'remeda';

import { useRealtime } from '@/entities/app/realtime';
import { useAppSettings } from '@/entities/app/settings';
import { armPttStream } from '@/shared/lib';
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
      armPttStream(p);
    }
  };

  const publishDeafened = (value: boolean) => {
    setIsDeafened(value);
    send({
      op: 'presence.patch',
      roomId: room.name,
      deafened: value,
    });
  };

  const setDeafened = async (next: boolean) => {
    if (isNullish(localParticipant)) {
      return;
    }

    publishDeafened(next);

    try {
      await (next ? enableDeafen(localParticipant) : disableDeafen(localParticipant));
    } catch (err) {
      console.error('deafen toggle failed', err);

      publishDeafened(!next);
    }
  };

  return {
    isDeafened,
    toggle: () => setDeafened(!isDeafened),
    undeafen: () => setDeafened(false),
  };
};
