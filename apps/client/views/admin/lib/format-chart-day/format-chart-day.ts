import { format, parseISO } from 'date-fns';

export const formatChartDay = (iso: string): string => {
  if (!iso) {
    return '';
  }

  return format(parseISO(iso), 'd MMM');
};
