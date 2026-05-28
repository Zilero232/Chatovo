import type { DisconnectReason } from 'livekit-client';

export type VoiceRoomProps = {
  roomId: string;
  roomName: string;
  serverUrl: string;
  token: string;
  onConnectFailure: (reason: DisconnectReason) => void;
  onLeave: () => void;
};
