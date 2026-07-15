'use client';

import { useIsMuted, useParticipantInfo, useParticipantTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { isNonNullish } from 'remeda';

import { readParticipantMeta } from '@/entities/room/room';
import { useParticipantIsSpeaking } from './use-participant-is-speaking';

import type { Participant } from 'livekit-client';

export const useParticipantMedia = (participant: Participant) => {
  const [cameraTrack] = useParticipantTracks([Track.Source.Camera], participant.identity);
  const [screenTrack] = useParticipantTracks([Track.Source.ScreenShare], participant.identity);
  const [micTrack] = useParticipantTracks([Track.Source.Microphone], participant.identity);

  const isSpeaking = useParticipantIsSpeaking(participant);
  const micMuted = useIsMuted(micTrack ?? { participant, source: Track.Source.Microphone });
  const cameraMuted = useIsMuted(cameraTrack ?? { participant, source: Track.Source.Camera });
  const screenMuted = useIsMuted(screenTrack ?? { participant, source: Track.Source.ScreenShare });

  const { name, metadata } = useParticipantInfo({ participant });
  const { verified, avatarUrl, bannerColor } = readParticipantMeta(metadata);

  const hasCamera = isNonNullish(cameraTrack) && !cameraMuted;
  const hasScreen = isNonNullish(screenTrack) && !screenMuted;

  return {
    cameraTrack,
    screenTrack,
    isSpeaking,
    micMuted,
    verified,
    avatarUrl,
    bannerColor,
    displayName: name || participant.identity,
    isLocal: participant.isLocal,
    hasCamera,
    hasScreen,
    hasVideo: hasCamera || hasScreen,
  };
};
