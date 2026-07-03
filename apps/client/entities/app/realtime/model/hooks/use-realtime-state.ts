'use client';

import { WebSocket } from 'partysocket';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { useCurrentUser } from '@/entities/auth/user';
import { buildRealtimeUrl } from '@/shared/api';
import {
  buildSubscribeMessage,
  dispatchRealtimeMessage,
  emptyPresence,
  parseRealtimeServerMessage,
  setSubscriptionSender,
  syncRoomSubscriptions,
} from '../lib';
import type { RealtimeClientMessage, RoomsParticipantsSnapshot } from '@chatovo/schemas';

export const useRealtimeState = () => {
  const { isAuthenticated } = useCurrentUser();
  const [presence, setPresence] = useState<RoomsParticipantsSnapshot>(emptyPresence);
  const [isConnected, setIsConnected] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const pendingSyncRef = useRef(false);

  const handleMessage = useEffectEvent(async (raw: unknown) => {
    const message = await parseRealtimeServerMessage(raw);

    if (!message) {
      return;
    }

    dispatchRealtimeMessage(message, {
      setPresence,
    });
  });

  const pushSubscriptions = useEffectEvent(() => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      pendingSyncRef.current = true;
      return;
    }

    pendingSyncRef.current = false;
    ws.send(JSON.stringify(buildSubscribeMessage()));
  });

  useEffect(() => {
    setSubscriptionSender(() => {
      pushSubscriptions();
    });
    syncRoomSubscriptions();

    return () => {
      setSubscriptionSender(null);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      wsRef.current?.close();
      wsRef.current = null;
      setIsConnected(false);
      setPresence(emptyPresence());
      pendingSyncRef.current = false;

      return;
    }

    const ws = new WebSocket(() => buildRealtimeUrl(), [], {
      connectionTimeout: 10_000,
      maxRetries: Infinity,
      debug: process.env.NODE_ENV === 'development',
    });

    wsRef.current = ws;

    const onOpen = () => {
      setIsConnected(true);
      syncRoomSubscriptions();
      window.setTimeout(syncRoomSubscriptions, 0);
    };
    const onClose = () => setIsConnected(false);
    const onMessage = (event: MessageEvent) => {
      void handleMessage(event.data);
    };

    ws.addEventListener('open', onOpen);
    ws.addEventListener('close', onClose);
    ws.addEventListener('message', onMessage);

    return () => {
      ws.removeEventListener('open', onOpen);
      ws.removeEventListener('close', onClose);
      ws.removeEventListener('message', onMessage);
      ws.close();
      wsRef.current = null;
    };
  }, [isAuthenticated]);

  const send = (message: RealtimeClientMessage) => {
    const ws = wsRef.current;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return;
    }

    ws.send(JSON.stringify(message));
  };

  return { presence, send, isConnected };
};
