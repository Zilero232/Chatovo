export type PushNotificationPayload = {
  channelId: string;
  data: Record<string, string>;
  notification: { title: string; body: string };
};

export type PushTokensPayload = PushNotificationPayload & {
  tokens: string[];
};

export type SendPushToUserInput = PushNotificationPayload & {
  userId: string;
  force?: boolean;
};
