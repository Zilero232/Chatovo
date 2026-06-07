import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { isNumber } from 'remeda';

const toDate = (value: Date | number) => (isNumber(value) ? new Date(value) : value);

export const formatMessageTime = (timestamp: Date | number) => {
  const date = toDate(timestamp);
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  if (isYesterday(date)) {
    return `yesterday, ${format(date, 'HH:mm')}`;
  }
  return format(date, 'd MMM, HH:mm');
};

export const isSameCalendarDay = (a: Date | number, b: Date | number) =>
  isSameDay(toDate(a), toDate(b));

export type DateDivider =
  | { kind: 'today' }
  | { kind: 'yesterday' }
  | { kind: 'date'; label: string };

export const getDateDivider = (timestamp: Date | number): DateDivider => {
  const date = toDate(timestamp);

  if (isToday(date)) {
    return { kind: 'today' };
  }
  if (isYesterday(date)) {
    return { kind: 'yesterday' };
  }

  return { kind: 'date', label: format(date, 'd MMMM yyyy') };
};
