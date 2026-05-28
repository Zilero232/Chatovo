import { setParticipantMicMuted } from '../presence';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { micStateRoute } from '../routes';

// LiveKit webhooks don't ship mute toggles (only track_published/unpublished),
// so the client tells the API directly each time the user flips the mic.
export const micStateHandler: RouteHandler<typeof micStateRoute, Env> = async (c) => {
  const { roomId, micMuted } = c.req.valid('json');
  const userId = c.get('userId');

  setParticipantMicMuted(roomId, userId, micMuted);

  return c.json({ ok: true }, 200);
};
