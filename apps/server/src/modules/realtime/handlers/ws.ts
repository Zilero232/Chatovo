import { upgradeWebSocket } from 'hono/bun';
import { auth } from '../../auth';
import { getUserCallSnapshot } from '../../friends/call-store';
import { addLobbyConnection, getSnapshot, removeLobbyConnection } from '../../livekit/presence';
import {
  getConnection,
  registerConnection,
  sendToConnection,
  unregisterConnection,
} from '../connection-store';
import { handleClientMessage } from './client-message';
import type { WSContext } from 'hono/ws';

type WsAttachment = {
  connectionId: string;
  userId: string;
};

const wsAttachments = new WeakMap<WSContext, WsAttachment>();

const authorize = async (token: string | null): Promise<string | null> => {
  if (!token) {
    return null;
  }

  const session = await auth.api.getSession({
    headers: new Headers({ Authorization: `Bearer ${token}` }),
  });

  return session?.user.id ?? null;
};

export const realtimeWsRoute = upgradeWebSocket((c) => {
  const token = new URL(c.req.url).searchParams.get('token');

  return {
    onOpen: async (_event, ws) => {
      const userId = await authorize(token);

      if (!userId) {
        ws.close(4401, 'Unauthorized');

        return;
      }

      const connection = registerConnection(userId, ws);

      wsAttachments.set(ws, { connectionId: connection.id, userId });

      addLobbyConnection(userId);

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
      const attachment = wsAttachments.get(ws);

      if (!attachment) {
        return;
      }

      const connection = getConnection(attachment.connectionId);

      if (!connection) {
        return;
      }

      await handleClientMessage(connection, event.data);
    },
    onClose: (_event, ws) => {
      const attachment = wsAttachments.get(ws);

      if (!attachment) {
        return;
      }

      wsAttachments.delete(ws);
      unregisterConnection(attachment.connectionId);
      removeLobbyConnection(attachment.userId);
    },
  };
});
