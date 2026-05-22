import { AccessToken } from 'livekit-server-sdk';
import { filter, first, isString, map, pipe } from 'remeda';
import { readRole } from '../../../lib/auth';
import { env } from '../../../lib/env';
import { verifyPassword } from '../../../lib/password';
import { prisma } from '../../../lib/prisma';
import { supabaseAdmin } from '../../../lib/supabase';
import type { ParticipantMetadata, TokenResponse } from '@chatovo/schemas';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { tokenRoute } from '../routes';

const resolveString = (value: unknown): string | null =>
  isString(value) && value.trim().length > 0 ? value.trim() : null;

const resolveDisplayName = (
  metadata: Record<string, unknown>,
  email: string | undefined,
  userId: string,
): string =>
  pipe(
    [metadata.display_name, metadata.full_name, metadata.name],
    map(resolveString),
    filter(isString),
    first(),
  ) ??
  email?.split('@')[0] ??
  userId;

export const tokenHandler: RouteHandler<typeof tokenRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const email = c.get('email');
  const { roomId, password } = c.req.valid('json');

  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room) return c.json({ error: 'Room not found' }, 404);

  if (room.isPrivate) {
    if (!password) return c.json({ error: 'Password required' }, 401);
    if (!room.passwordHash) return c.json({ error: 'Room misconfigured' }, 500);

    const ok = await verifyPassword(password, room.passwordHash);

    if (!ok) return c.json({ error: 'Invalid password' }, 403);
  }

  const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

  if (error || !data.user) return c.json({ error: 'User lookup failed' }, 500);

  const appMetadata = data.user.app_metadata ?? {};
  const userMetadata = data.user.user_metadata ?? {};

  const isAdmin = readRole(appMetadata) === 'admin';
  const verified = appMetadata.verified === true;
  const displayName = resolveDisplayName(userMetadata, email, userId);
  const profileUrl = resolveString(userMetadata.profile_url);

  const participantMetadata: ParticipantMetadata = {
    email: email ?? null,
    verified,
    profileUrl,
  };

  const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: userId,
    name: displayName,
    metadata: JSON.stringify(participantMetadata),
    ttl: 60 * 60,
  });

  at.addGrant({
    room: room.id,
    roomJoin: true,
    roomCreate: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: isAdmin,
  });

  const payload: TokenResponse = {
    token: await at.toJwt(),
  };

  return c.json(payload, 200);
};
