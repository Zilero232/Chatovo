import { format, isToday, isYesterday } from 'date-fns';
import { isNumber } from 'remeda';

export const formatMessageTime = (timestamp: Date | number) => {
  const date = isNumber(timestamp) ? new Date(timestamp) : timestamp;
  if (isToday(date)) return format(date, 'HH:mm');
  if (isYesterday(date)) return `yesterday, ${format(date, 'HH:mm')}`;
  return format(date, 'd MMM, HH:mm');
};
