import { sortBy } from 'remeda';

import type { ChatLine } from '../types';

export const mergeChatLines = (cached: ChatLine[], fetched: ChatLine[]): ChatLine[] => {
  const byId = new Map(fetched.map((line) => [line.id, line]));

  for (const line of cached) {
    if (!byId.has(line.id)) {
      byId.set(line.id, line);
    }
  }

  return sortBy([...byId.values()], (line) => line.timestamp);
};

export const appendChatLine = (lines: ChatLine[] | undefined, line: ChatLine): ChatLine[] => {
  if (!lines) {
    return [line];
  }

  if (lines.some((item) => item.id === line.id)) {
    return lines;
  }

  return [...lines, line];
};

export const applyChatEditToLines = (
  lines: ChatLine[],
  id: string,
  body: string,
  editedAt: number,
): ChatLine[] => {
  return lines.map((line) => (line.id === id ? { ...line, message: body, editedAt } : line));
};

export const applyChatDeleteToLines = (
  lines: ChatLine[],
  id: string,
  deletedAt: number,
): ChatLine[] => {
  return lines.map((line) => (line.id === id ? { ...line, message: '', deletedAt } : line));
};
