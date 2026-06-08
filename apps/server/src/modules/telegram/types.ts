export type VoiceJoinNotification = {
  roomId: string;
  roomName: string;
  participantName: string;
};

export type VoiceEmptyNotification = {
  roomName: string;
};

export type UserSignupNotification = {
  name: string;
  email: string;
};

export type RoomCreatedNotification = {
  roomName: string;
  ownerName: string;
  isPrivate: boolean;
  password?: string | null;
};

export type RoomDeletedNotification = {
  roomName: string;
  ownerName: string;
};

export type ProblemReportNotification = {
  reporter: string;
  email: string;
  description: string;
  platform?: string;
  appVersion?: string;
};
