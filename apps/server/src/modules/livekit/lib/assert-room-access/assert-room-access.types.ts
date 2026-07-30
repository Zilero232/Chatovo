export type AssertRoomAccessInput = {
  room: { kind: string; isPrivate: boolean; password: string | null };
  password?: string;
};
