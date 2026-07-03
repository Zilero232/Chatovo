import { getSubscribedRooms } from './subscription-registry';

type SubscriptionSender = () => void;

let sender: SubscriptionSender | null = null;

export const setSubscriptionSender = (next: SubscriptionSender | null): void => {
  sender = next;
};

export const syncRoomSubscriptions = (): void => {
  sender?.();
};

export const buildSubscribeMessage = () => ({
  op: 'subscribe' as const,
  rooms: getSubscribedRooms(),
});
