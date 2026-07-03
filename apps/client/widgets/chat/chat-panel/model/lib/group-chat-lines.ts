import { isSameCalendarDay } from '@/shared/lib';
import type { ChatLine } from '../types';

export type GroupedChatLine = {
  line: ChatLine;
  isOwn: boolean;
  isGrouped: boolean;
  isTail: boolean;
  showDivider: boolean;
};

const sameAuthor = (a?: ChatLine, b?: ChatLine) =>
  Boolean(a && b && a.from?.identity === b.from?.identity);

const sameDay = (a?: ChatLine, b?: ChatLine) =>
  Boolean(a && b && isSameCalendarDay(a.timestamp, b.timestamp));

const continuesSeries = (a?: ChatLine, b?: ChatLine) => sameAuthor(a, b) && sameDay(a, b);

export const groupChatLines = (lines: ChatLine[], ownIdentity: string): GroupedChatLine[] =>
  lines.map((line, index) => {
    const prev = lines[index - 1];
    const next = lines[index + 1];

    return {
      line,
      isOwn: line.from?.identity === ownIdentity,
      isGrouped: continuesSeries(prev, line),
      isTail: !continuesSeries(line, next),
      showDivider: !sameDay(prev, line),
    };
  });
