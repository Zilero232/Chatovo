export type VoiceJoinNotification = {
  participantName: string;
  roomId: string;
  roomName: string;
};

export type VoiceEmptyNotification = {
  roomName: string;
};

export type UserSignupNotification = {
  email: string;
  name: string;
};

export type RoomCreatedNotification = {
  isPrivate: boolean;
  ownerName: string;
  password?: string | null;
  roomName: string;
};

export type RoomDeletedNotification = {
  ownerName: string;
  roomName: string;
};

export type ProblemReportNotification = {
  appVersion?: string;
  description: string;
  email: string;
  platform?: string;
  reporter: string;
};
