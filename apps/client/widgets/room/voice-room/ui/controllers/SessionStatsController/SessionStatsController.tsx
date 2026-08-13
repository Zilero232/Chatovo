'use client';

import type { Participant } from 'livekit-client';

import { useParticipants } from '@livekit/components-react';
import { useEffect, useEffectEvent } from 'react';

import { ROSTER_EVENTS } from '../../../config';
import { useSessionStats } from '../../../model/contexts';
import { useParticipantIsSpeaking } from '../../../model/hooks';

const ParticipantStatsTracker = ({ participant }: { participant: Participant }) => {
  const { track } = useSessionStats();

  const isSpeaking = useParticipantIsSpeaking(participant);
  const { identity } = participant;

  const trackSpeaking = useEffectEvent(() => {
    track({ identity, isSpeaking });
  });

  useEffect(() => {
    trackSpeaking();
  }, [identity, isSpeaking]);

  return null;
};

export const SessionStatsController = () => {
  const participants = useParticipants({ updateOnlyOn: ROSTER_EVENTS });

  return (
    <>
      {participants.map((participant) => (
        <ParticipantStatsTracker key={participant.identity} participant={participant} />
      ))}
    </>
  );
};
