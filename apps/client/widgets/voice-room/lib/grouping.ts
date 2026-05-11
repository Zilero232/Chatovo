import type { MessageGroup, RawMessage } from '../model/types';

const GROUP_WINDOW_MS = 5 * 60_000;

export const groupMessages = (messages: RawMessage[]): MessageGroup[] => {
  const groups: MessageGroup[] = [];
  for (const m of messages) {
    const sender = m.from?.identity ?? 'system';
    const last = groups[groups.length - 1];
    if (last && last.sender === sender && m.timestamp - last.first < GROUP_WINDOW_MS) {
      last.messages.push(m);
    } else {
      groups.push({ sender, first: m.timestamp, messages: [m] });
    }
  }
  return groups;
};
