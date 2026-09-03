import { format } from 'date-fns';

export const formatAdminDate = (iso: string): string => format(new Date(iso), 'd MMM yyyy, HH:mm');
