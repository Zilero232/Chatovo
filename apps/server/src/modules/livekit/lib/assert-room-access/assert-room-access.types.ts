export type AssertRoomAccessInput = {
  room: { id: string; kind: string; isPrivate: boolean; password: string | null };
  userId: string;
  password?: string;
};
