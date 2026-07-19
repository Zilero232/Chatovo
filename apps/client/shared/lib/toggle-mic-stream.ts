import { type LocalParticipant, Track } from 'livekit-client';

export const toggleMicStream = (participant: LocalParticipant, enabled: boolean): boolean => {
  const publication = participant.getTrackPublication(Track.Source.Microphone);
  const stream = publication?.track?.mediaStreamTrack;

  if (!stream) {
    return false;
  }

  stream.enabled = enabled;

  return true;
};

export const armPttStream = (participant: LocalParticipant) => toggleMicStream(participant, false);
