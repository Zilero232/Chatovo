import { upgradeWebSocket } from 'hono/bun';

import { auth } from '../../auth';
import { getUserCallSnapshot } from '../../friends/call-store';
import { addLobbyConnection, getSnapshot, removeLobbyConnection } from '../../livekit/presence';
import {
  getConnectionByWs,
  registerConnection,
  sendToConnection,
  unregisterConnection,
} from '../connection-store';
import { handleClientMessage } from './client-message';

import type { WSContext } from 'hono/ws';
import type { RealtimeConnection } from '../connection-store';

type WsInbound = string | ArrayBuffer | SharedArrayBuffer | Blob;

const pendingInbound = new WeakMap<object, WsInbound[]>();

const wsKey = (ws: WSContext): object => {
  return (ws.raw ?? ws) as object;
};

const authorize = async (token: string | null): Promise<string | null> => {
  if (!token) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${token}` }),
  });

  return session?.user.id ?? null;
};

const drainPendingInbound = async (
  ws: WSContext,
  connection: RealtimeConnection,
): Promise<void> => {
  const queued = pendingInbound.get(wsKey(ws));

  if (!queued?.length) {
    return;
  }

  pendingInbound.delete(wsKey(ws));

  for (const raw of queued) {
    await handleClientMessage(connection, raw);
  }
};

const queueInbound = (ws: WSContext, raw: WsInbound): void => {
  const key = wsKey(ws);
  const queued = pendingInbound.get(key);

  if (queued) {
    queued.push(raw);
    return;
  }

  pendingInbound.set(key, [raw]);
};

export const realtimeWsRoute = upgradeWebSocket((c) => {
  const token = new URL(c.req.url).searchParams.get('token');

  return {
    onOpen: async (_event, ws) => {
      const userId = await authorize(token);

      if (!userId) {
        pendingInbound.delete(wsKey(ws));
        ws.close(4401, 'Unauthorized');

        return;
      }

      const connection = registerConnection(userId, ws);

      addLobbyConnection(userId);

      await drainPendingInbound(ws, connection);

      sendToConnection(connection.id, {
        type: 'presence.snapshot',
        snapshot: getSnapshot(),
      });

      sendToConnection(connection.id, {
        type: 'friends.snapshot',
        snapshot: getUserCallSnapshot(userId),
      });
    },
    onMessage: async (event, ws) => {
      const connection = getConnectionByWs(ws);

      if (!connection) {
        queueInbound(ws, event.data);
        return;
      }

      await handleClientMessage(connection, event.data);
    },
    onClose: (_event, ws) => {
      pendingInbound.delete(wsKey(ws));

      const connection = getConnectionByWs(ws);

      if (!connection) {
        return;
      }

      unregisterConnection(connection.id);
      removeLobbyConnection(connection.userId);
    },
  };
});
