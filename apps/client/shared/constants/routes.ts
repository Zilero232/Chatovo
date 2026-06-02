export const ROUTES = {
  lobby: '/',
  auth: '/auth',
  room: (roomId: string) => {
    return `/room/${encodeURIComponent(roomId)}`;
  },
} as const;
