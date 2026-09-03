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

export type AbuseReportNotification = {
  comment?: string;
  reason: string;
  reporter: string;
  roomName?: string;
  target: string;
  targetId: string;
};

export type UserBlockedNotification = {
  blockedBy: string;
  email: string;
  reason: string;
  userName: string;
};
