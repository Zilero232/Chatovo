export type PushNotificationPayload = {
  notification: { title: string; body: string };
  data: Record<string, string>;
  channelId: string;
};

export type PushTokensPayload = PushNotificationPayload & {
  tokens: string[];
};

export type SendPushToUserInput = PushNotificationPayload & {
  userId: string;
};
