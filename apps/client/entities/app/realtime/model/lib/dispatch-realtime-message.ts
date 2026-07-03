import { realtimeServerMessageSchema, safeJsonParse } from '@chatovo/schemas';
import { isString } from 'remeda';
import { match } from 'ts-pattern';
import { publishRealtimeMessage } from './message-listeners';
import type { RealtimeServerMessage, RoomsParticipantsSnapshot } from '@chatovo/schemas';

const EMPTY_PRESENCE: RoomsParticipantsSnapshot = { rooms: {}, lobbyOnline: 0 };

export const parseRealtimeServerMessage = (raw: unknown): RealtimeServerMessage | null => {
  if (!isString(raw)) {
    return null;
  }

  const parsed = realtimeServerMessageSchema.safeParse(safeJsonParse(raw));

  return parsed.success ? parsed.data : null;
};

const shouldPublish = (message: RealtimeServerMessage): boolean => {
  return (
    message.type === 'friends.snapshot' ||
    message.type === 'room.reaction' ||
    message.type === 'chat.message' ||
    message.type === 'chat.edit' ||
    message.type === 'chat.delete'
  );
};

export const dispatchRealtimeMessage = (
  message: RealtimeServerMessage,
  deps: {
    setPresence: (snapshot: RoomsParticipantsSnapshot) => void;
  },
): void => {
  const { setPresence } = deps;

  match(message)
    .with({ type: 'presence.snapshot' }, ({ snapshot }) => {
      setPresence(snapshot);
    })
    .with({ type: 'friends.snapshot' }, () => {})
    .with({ type: 'room.reaction' }, () => {})
    .with({ type: 'chat.message' }, () => {})
    .with({ type: 'chat.edit' }, () => {})
    .with({ type: 'chat.delete' }, () => {})
    .exhaustive();

  if (shouldPublish(message)) {
    publishRealtimeMessage(message);
  }
};

export const emptyPresence = (): RoomsParticipantsSnapshot => EMPTY_PRESENCE;
