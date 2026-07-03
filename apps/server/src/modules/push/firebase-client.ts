import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { env } from '../../core';
import type { ServiceAccount } from 'firebase-admin/app';
import type { Message, Messaging, SendResponse } from 'firebase-admin/messaging';
import type { PushTokensPayload } from './types';

let messaging: Messaging | null | undefined;

const getMessagingClient = (): Messaging | null => {
  if (messaging !== undefined) {
    return messaging;
  }

  const raw = env.FIREBASE_SERVICE_ACCOUNT;

  if (!raw) {
    messaging = null;

    return null;
  }

  try {
    const serviceAccount = JSON.parse(raw) as ServiceAccount;

    if (!getApps().length) {
      initializeApp({ credential: cert(serviceAccount) });
    }

    messaging = getMessaging();
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';

    console.error(`Firebase init error: ${reason}`);
    messaging = null;
  }

  return messaging;
};

const pickInvalidTokens = (tokens: string[], responses: SendResponse[]): string[] => {
  return tokens.filter((_, index) => {
    const code = responses[index]?.error?.code;

    return (
      code === 'messaging/invalid-registration-token' ||
      code === 'messaging/registration-token-not-registered'
    );
  });
};

export const sendPushToTokens = async ({
  tokens,
  notification,
  data,
  channelId,
}: PushTokensPayload): Promise<string[]> => {
  const client = getMessagingClient();

  if (!client || tokens.length === 0) {
    return [];
  }

  const messages: Message[] = tokens.map((token) => {
    return {
      token,
      notification,
      data,
      android: {
        priority: 'high',
        notification: { channelId },
      },
      apns: { payload: { aps: { sound: 'default' } } },
    };
  });

  try {
    const result = await client.sendEach(messages);

    return pickInvalidTokens(tokens, result.responses);
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';

    console.error(`FCM send error: ${reason}`);

    return [];
  }
};
