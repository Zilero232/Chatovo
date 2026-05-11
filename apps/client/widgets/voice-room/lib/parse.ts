import type { ChatMessage } from '../model/types';

export const parseMessage = (raw: string): ChatMessage => {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && (parsed.type === 'text' || parsed.type === 'file')) return parsed;
  } catch {}
  return { type: 'text', body: raw };
};
