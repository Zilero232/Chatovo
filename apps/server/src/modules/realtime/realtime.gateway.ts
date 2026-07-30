import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import type { IncomingMessage } from 'node:http';
import type { WebSocket } from 'ws';

import { Logger } from '@nestjs/common';
import { WebSocketGateway } from '@nestjs/websockets';

import { FriendshipService, getUserCallSnapshot } from '../friends';
import { addLobbyConnection, getSnapshot, removeLobbyConnection } from '../livekit';
import { HEARTBEAT_INTERVAL_MS } from './config';
import {
  getConnectionByWs,
  hasUserConnection,
  listConnections,
  markConnectionAlive,
  registerConnection,
  sendToConnection,
  unregisterConnection
} from './connection-store';
import { handleClientMessage } from './handlers/client-message';
import { authorizeToken } from './lib';

@WebSocketGateway({ path: '/realtime' })
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RealtimeGateway.name);

  private heartbeat: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly friendship: FriendshipService) {}

  onModuleInit() {
    this.heartbeat = setInterval(() => {
      for (const connection of listConnections()) {
        if (!connection.isAlive) {
          connection.ws.terminate();

          continue;
        }

        connection.isAlive = false;
        connection.ws.ping();
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  onModuleDestroy() {
    if (this.heartbeat) {
      clearInterval(this.heartbeat);
    }
  }

  async handleConnection(client: WebSocket, request: IncomingMessage) {
    const token = new URL(request.url ?? '/', 'http://localhost').searchParams.get('token');
    const userId = await authorizeToken(token);

    if (!userId) {
      client.close(4401, 'Unauthorized');

      return;
    }

    const connection = registerConnection(userId, client);

    addLobbyConnection(userId);

    client.on('pong', () => {
      markConnectionAlive(client);
    });

    client.on('message', (data: Buffer) => {
      handleClientMessage(connection, data).catch((error: unknown) => {
        this.logger.warn(`Realtime message failed: ${String(error)}`);
      });
    });

    sendToConnection(connection.id, {
      type: 'presence.snapshot',
      snapshot: getSnapshot()
    });

    sendToConnection(connection.id, {
      type: 'friends.snapshot',
      snapshot: getUserCallSnapshot(userId)
    });

    await this.friendship.broadcastFriendPresence({ userId, isOnline: true });
  }

  async handleDisconnect(client: WebSocket) {
    const connection = getConnectionByWs(client);

    if (!connection) {
      return;
    }

    const { userId } = connection;

    unregisterConnection(connection.id);
    removeLobbyConnection(userId);

    if (!hasUserConnection(userId)) {
      await this.friendship.broadcastFriendPresence({ userId, isOnline: false });
    }
  }
}
