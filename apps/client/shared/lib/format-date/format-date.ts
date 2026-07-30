import { format, isSameDay, isToday, isYesterday } from 'date-fns';
import { isNumber } from 'remeda';

const toDate = (value: number | Date) => (isNumber(value) ? new Date(value) : value);

export const formatMessageTime = (timestamp: number | Date) => {
  const date = toDate(timestamp);
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  if (isYesterday(date)) {
    return `yesterday, ${format(date, 'HH:mm')}`;
  }
  return format(date, 'd MMM, HH:mm');
};

export const isSameCalendarDay = (a: number | Date, b: number | Date) =>
  isSameDay(toDate(a), toDate(b));

export type DateDivider =
  { kind: 'date'; label: string } | { kind: 'today' } | { kind: 'yesterday' };

export const getDateDivider = (timestamp: number | Date): DateDivider => {
  const date = toDate(timestamp);

  if (isToday(date)) {
    return { kind: 'today' };
  }
  if (isYesterday(date)) {
    return { kind: 'yesterday' };
  }

  return { kind: 'date', label: format(date, 'd MMMM yyyy') };
};
