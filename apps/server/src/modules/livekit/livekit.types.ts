import type { RoomParticipant } from '@chatovo/schemas';

export type IssueTokenInput = {
  isAdmin: boolean;
  password?: string;
  roomId: string;
  userId: string;
};

export type ParticipantPatch = Partial<Pick<RoomParticipant, 'deafened' | 'micMuted'>>;
