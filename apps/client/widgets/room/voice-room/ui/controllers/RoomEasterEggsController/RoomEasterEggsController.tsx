'use client';

import { useLocalParticipant, useParticipants } from '@livekit/components-react';

import { useAchievementTracker } from '@/features/app/achievements';
import { useAloneAmbience } from '@/features/app/alone-ambience';

import { ROSTER_EVENTS } from '../../../config';

export const RoomEasterEggsController = () => {
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });
  const { isMicrophoneEnabled } = useLocalParticipant();

  const isAlone = participants.length === 1;

  useAchievementTracker({
    isInRoom: true,
    isMicEnabled: isMicrophoneEnabled,
    participantCount: participants.length
  });
  useAloneAmbience({ isAlone, isEnabled: true });

  return null;
};
