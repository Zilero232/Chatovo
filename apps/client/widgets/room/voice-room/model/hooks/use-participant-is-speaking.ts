'use client';

import { useIsSpeaking } from '@livekit/components-react';
import { useLocalSpeaking } from '../contexts';
import type { Participant } from 'livekit-client';

export const useParticipantIsSpeaking = (participant: Participant) => {
  const livekitSpeaking = useIsSpeaking(participant);
  const { isSpeaking: localSpeaking } = useLocalSpeaking();

  return participant.isLocal ? localSpeaking : livekitSpeaking;
};
