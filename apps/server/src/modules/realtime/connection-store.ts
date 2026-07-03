import { bindRealtimeBroadcast as bindEmit } from './emit';
import type { RealtimeServerMessage } from '@chatovo/schemas';
import type { WSContext } from 'hono/ws';

export type RealtimeConnection = {
  id: string;
  userId: string;
  ws: WSContext;
  rooms: Set<string>;
};

const connections = new Map<string, RealtimeConnection>();
const byUser = new Map<string, Set<string>>();
const byRoom = new Map<string, Set<string>>();

const send = (connection: RealtimeConnection, message: RealtimeServerMessage): void => {
  try {
    connection.ws.send(JSON.stringify(message));
  } catch {}
};

const linkRoom = (connectionId: string, roomId: string) => {
  let roomConnections = byRoom.get(roomId);

  if (!roomConnections) {
    roomConnections = new Set();
    byRoom.set(roomId, roomConnections);
  }

  roomConnections.add(connectionId);
};

const unlinkRoom = (connectionId: string, roomId: string) => {
  const roomConnections = byRoom.get(roomId);

  if (!roomConnections) {
    return;
  }

  roomConnections.delete(connectionId);

  if (roomConnections.size === 0) {
    byRoom.delete(roomId);
  }
};

export const getConnectionByWs = (ws: WSContext): RealtimeConnection | null => {
  const raw = ws.raw;

  for (const connection of connections.values()) {
    if (connection.ws === ws || (raw !== undefined && connection.ws.raw === raw)) {
      return connection;
    }
  }

  return null;
};

export const registerConnection = (userId: string, ws: WSContext): RealtimeConnection => {
  const id = crypto.randomUUID();
  const connection: RealtimeConnection = { id, userId, ws, rooms: new Set() };

  connections.set(id, connection);

  let userConnections = byUser.get(userId);

  if (!userConnections) {
    userConnections = new Set();
    byUser.set(userId, userConnections);
  }

  userConnections.add(id);

  return connection;
};

export const getConnection = (connectionId: string): RealtimeConnection | null => {
  return connections.get(connectionId) ?? null;
};

export const unregisterConnection = (connectionId: string): RealtimeConnection | null => {
  const connection = connections.get(connectionId);

  if (!connection) {
    return null;
  }

  connections.delete(connectionId);

  const userConnections = byUser.get(connection.userId);
  userConnections?.delete(connectionId);

  if (userConnections?.size === 0) {
    byUser.delete(connection.userId);
  }

  for (const roomId of connection.rooms) {
    unlinkRoom(connectionId, roomId);
  }

  return connection;
};

export const setConnectionRooms = (connectionId: string, roomIds: string[]): void => {
  const connection = connections.get(connectionId);

  if (!connection) {
    return;
  }

  for (const roomId of connection.rooms) {
    unlinkRoom(connectionId, roomId);
  }

  connection.rooms.clear();

  for (const roomId of roomIds) {
    connection.rooms.add(roomId);
    linkRoom(connectionId, roomId);
  }
};

export const sendToConnection = (connectionId: string, message: RealtimeServerMessage): void => {
  const connection = connections.get(connectionId);

  if (!connection) {
    return;
  }

  send(connection, message);
};

export const sendToUser = (userId: string, message: RealtimeServerMessage): void => {
  const userConnections = byUser.get(userId);

  if (!userConnections) {
    return;
  }

  for (const connectionId of userConnections) {
    const connection = connections.get(connectionId);

    if (connection) {
      send(connection, message);
    }
  }
};

export const sendToRoom = (roomId: string, message: RealtimeServerMessage): void => {
  const roomConnections = byRoom.get(roomId);

  if (!roomConnections) {
    return;
  }

  for (const connectionId of roomConnections) {
    const connection = connections.get(connectionId);

    if (connection) {
      send(connection, message);
    }
  }
};

export const sendToAll = (message: RealtimeServerMessage): void => {
  for (const connection of connections.values()) {
    send(connection, message);
  }
};

export const initRealtimeBroadcast = (): void => {
  bindEmit({
    presence: (message) => {
      sendToAll(message);
    },
    friends: (userId, message) => {
      sendToUser(userId, message);
    },
    room: (roomId, message) => {
      sendToRoom(roomId, message);
    },
  });
};
