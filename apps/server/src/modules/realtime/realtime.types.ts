import type { WebSocket } from 'ws';

export type RealtimeConnection = {
  id: string;
  isAlive: boolean;
  rooms: Set<string>;
  userId: string;
  ws: WebSocket;
};
