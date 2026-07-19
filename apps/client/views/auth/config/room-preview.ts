export type AuthRoomSpeaker = {
  id: string;
  initial: string;
  isSpeaking: boolean;
};

export const AUTH_ROOM_SPEAKERS: AuthRoomSpeaker[] = [
  { id: 'a', initial: 'A', isSpeaking: true },
  { id: 'm', initial: 'M', isSpeaking: false },
  { id: 'k', initial: 'K', isSpeaking: true },
  { id: 'd', initial: 'D', isSpeaking: false },
];

export const AUTH_STAT_KEYS = ['setup', 'free', 'limit'] as const;

export type AuthStatKey = (typeof AUTH_STAT_KEYS)[number];
