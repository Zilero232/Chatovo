import type { WebSocket } from 'ws';

export type RealtimeConnection = {
  id: string;
  userId: string;
  ws: WebSocket;
  rooms: Set<string>;
};
