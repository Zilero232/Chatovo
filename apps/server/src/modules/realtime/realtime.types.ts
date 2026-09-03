import type { RoomsParticipantsSnapshot } from '@chatovo/schemas';
import type { WebSocket } from 'ws';

export type RealtimeConnection = {
  id: string;
  isAdmin: boolean;
  isAlive: boolean;
  rooms: Set<string>;
  userId: string;
  ws: WebSocket;
};

export type PresenceSnapshots = {
  admin: RoomsParticipantsSnapshot;
  public: RoomsParticipantsSnapshot;
};
