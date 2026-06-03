export const APP_SCHEME = 'chatovo';

const AUTH_PATH = '/auth';

export const ROUTES = {
  lobby: '/',
  auth: AUTH_PATH,
  resetPassword: `${AUTH_PATH}/reset-password`,
  room: '/room',
} as const;

export const DEEP_LINKS = {
  auth: `${APP_SCHEME}://auth`,
} as const;

export const buildRoomHref = (roomId: string) => {
  return `${ROUTES.room}?id=${encodeURIComponent(roomId)}`;
};

export const buildAbsoluteUrl = (path: string) => {
  return `${window.location.origin}${path}`;
};
