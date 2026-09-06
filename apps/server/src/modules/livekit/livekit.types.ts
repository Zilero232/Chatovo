import type { RoomParticipant } from '@chatovo/schemas';
import type { ParticipantInfo } from 'livekit-server-sdk';

export type IssueTokenInput = {
  isAdmin: boolean;
  invisible?: boolean;
  password?: string;
  roomId: string;
  userId: string;
};

export type ToRoomParticipantInput = {
  invisible: boolean;
  participant: ParticipantInfo;
};

export type ParticipantPatch = Partial<Pick<RoomParticipant, 'activity' | 'deafened' | 'micMuted'>>;
