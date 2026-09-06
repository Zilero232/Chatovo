export type RoomSession = {
  isChatOpen: boolean;
  isDm: boolean;
  isPrivate: boolean;
  password?: string;
  isInvisible: boolean;
  roomId: string;
  roomName: string;
  token: string;
};

export type RoomSessionValue = {
  close: (roomId?: string) => void;
  open: (session: RoomSession) => void;
  session: RoomSession | null;
};
