import type { CreateRoomRequest, UpdateRoomRequest } from '@chatovo/schemas';

export type CreateRoomInput = {
  input: CreateRoomRequest;
  ownerId: string;
};

export type UpdateRoomInput = {
  roomId: string;
  input: UpdateRoomRequest;
  userId: string;
};

export type DeleteRoomInput = {
  roomId: string;
  userId: string;
};

export type GetRoomInput = {
  roomId: string;
  userId: string;
};
