'use client';

import { useLocalParticipant } from '@livekit/components-react';
import { ParticipantEvent } from 'livekit-client';
import { useEffect } from 'react';
import { reportMicState } from '@/shared/api';
import type { MicStateControllerProps } from './MicStateController.types';

// LiveKit webhooks ship `track_published` / `track_unpublished` but NOT
// `track_muted` / `track_unmuted`. To keep the presence cache in sync with
// live mute toggles, the local participant reports its mic state to the API
// each time it changes (initial mount + every Track* event).
export const MicStateController = ({ roomId }: MicStateControllerProps) => {
  const { localParticipant } = useLocalParticipant();

  useEffect(() => {
    if (!localParticipant) return;

    const push = () => {
      void reportMicState({ roomId, micMuted: !localParticipant.isMicrophoneEnabled });
    };

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
  }, [localParticipant, roomId]);

  return null;
};
