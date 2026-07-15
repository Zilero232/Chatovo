import type { RoomParticipant } from '@chatovo/schemas';

export type IssueTokenInput = {
  roomId: string;
  password?: string;
  userId: string;
  email: string | null;
  isAdmin: boolean;
};

export type ParticipantPatch = Partial<Pick<RoomParticipant, 'micMuted' | 'deafened'>>;
