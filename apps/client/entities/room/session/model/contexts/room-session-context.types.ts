export type RoomSession = {
  isChatOpen: boolean;
  isDm: boolean;
  isInvisible: boolean;
  roomId: string;
  roomName: string;
  serverId: string | null;
  token: string;
};

export type RoomSessionValue = {
  close: (roomId?: string) => void;
  isRecentlyLeft: (roomId: string) => boolean;
  open: (session: RoomSession) => void;
  rejoin: () => void;
  session: RoomSession | null;
};
