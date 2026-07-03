import type { DisconnectReason } from 'livekit-client';

export type VoiceRoomProps = {
  roomId: string;
  roomName: string;
  serverUrl: string;
  token: string;
  initialChatOpen?: boolean;
  isDm?: boolean;
  onConnectFailure: (reason: DisconnectReason) => void;
  onLeave: () => void;
};
