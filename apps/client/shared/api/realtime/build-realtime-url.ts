import { env } from '@/shared/config';
import { getAuthToken } from '../auth';

export const buildRealtimeUrl = (): string => {
  const token = getAuthToken();

  if (!token) {
    throw new Error('Not authenticated');
  }

  const base = env.NEXT_PUBLIC_API_URL.replace(/^http/, 'ws').replace(/\/$/, '');

  return `${base}/realtime?token=${encodeURIComponent(token)}`;
};
