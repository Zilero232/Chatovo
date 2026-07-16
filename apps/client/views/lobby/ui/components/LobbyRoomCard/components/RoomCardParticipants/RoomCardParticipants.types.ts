import type { RoomParticipant } from '@chatovo/schemas';

export type RoomCardParticipantsProps = {
  ownerId: string;
  participants: RoomParticipant[];
};
