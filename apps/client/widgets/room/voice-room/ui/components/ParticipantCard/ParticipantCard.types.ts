import type { Participant } from 'livekit-client';

export type ParticipantCardProps = {
  deafened: boolean;
  fill?: boolean;
  invisible?: boolean;
  participant: Participant;
};
