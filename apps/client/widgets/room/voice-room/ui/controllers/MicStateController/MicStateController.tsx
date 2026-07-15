'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { ParticipantEvent } from 'livekit-client';
import { useEffect, useEffectEvent } from 'react';

import { useRealtime } from '@/entities/app/realtime';

import type { MicStateControllerProps } from './MicStateController.types';

export const MicStateController = ({ roomId }: MicStateControllerProps) => {
  const { send } = useRealtime();
  const { localParticipant } = useLocalParticipant();

  const push = useEffectEvent(() => {
    if (!localParticipant) {
      return;
    }

    send({
      op: 'presence.patch',
      roomId,
      micMuted: !localParticipant.isMicrophoneEnabled,
    });
  });

  useEffect(() => {
    if (!localParticipant) {
      return;
    }

    push();

    localParticipant.on(ParticipantEvent.TrackMuted, push);
    localParticipant.on(ParticipantEvent.TrackUnmuted, push);
    localParticipant.on(ParticipantEvent.TrackPublished, push);
    localParticipant.on(ParticipantEvent.LocalTrackPublished, push);
    localParticipant.on(ParticipantEvent.LocalTrackUnpublished, push);

    return () => {
      localParticipant.off(ParticipantEvent.TrackMuted, push);
      localParticipant.off(ParticipantEvent.TrackUnmuted, push);
      localParticipant.off(ParticipantEvent.TrackPublished, push);
      localParticipant.off(ParticipantEvent.LocalTrackPublished, push);
      localParticipant.off(ParticipantEvent.LocalTrackUnpublished, push);
    };
  }, [localParticipant]);

  return null;
};
