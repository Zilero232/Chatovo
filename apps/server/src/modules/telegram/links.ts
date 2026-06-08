import { env } from '../../core';

export const roomUrl = (roomId: string): string => {
  const origin = env.CORS_ORIGINS.split(',')[0]?.trim() ?? '';

  return `${origin}/room?id=${encodeURIComponent(roomId)}`;
};
