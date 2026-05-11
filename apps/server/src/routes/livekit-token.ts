import { zValidator } from '@hono/zod-validator';
import { tokenRequestSchema } from '@solvex/shared';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { type AuthVariables, requireSupabaseUser } from '@/middleware/auth';
import { issueLiveKitToken, type ParticipantRole } from '@/services/livekit';

const readRole = (metadata: Record<string, unknown> | undefined): ParticipantRole =>
  metadata?.role === 'admin' ? 'admin' : 'user';

export const livekitTokenRoute = new Hono<{ Variables: AuthVariables }>()
  .use('*', requireSupabaseUser)
  .post('/', zValidator('json', tokenRequestSchema), async (c) => {
    const { room, createIfMissing } = c.req.valid('json');
    const user = c.get('user');
    const role = readRole(user.app_metadata);

    if (createIfMissing && role !== 'admin') {
      throw new HTTPException(403, { message: 'Only admin can create rooms' });
    }

    const { token, url } = await issueLiveKitToken({
      room,
      identity: user.id,
      name: user.email ?? user.id,
      role,
    });

    return c.json({ token, url, isAdmin: role === 'admin' });
  });
