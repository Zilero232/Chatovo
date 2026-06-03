import { StatusCodes } from 'http-status-codes';
import { AccessToken } from 'livekit-server-sdk';
import { TOKEN_TTL_SECONDS } from '../../../config/livekit';
import { env, prisma } from '../../../core';
import { toUserProfile } from '../../users/profile';
import type { ParticipantMetadata, TokenResponse } from '@chatovo/schemas';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../../shared/types';
import type { tokenRoute } from '../routes';

export const tokenHandler: RouteHandler<typeof tokenRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const email = c.get('email');
  const role = c.get('role');
  const { roomId, password } = c.req.valid('json');

  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (!room) {
    return c.json({ error: 'Room not found' }, StatusCodes.NOT_FOUND);
  }

  if (room.isPrivate) {
    if (!password) {
      return c.json({ error: 'Password required' }, StatusCodes.UNAUTHORIZED);
    }
    if (!room.password) {
      return c.json({ error: 'Room misconfigured' }, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    if (password !== room.password) {
      return c.json({ error: 'Invalid password' }, StatusCodes.FORBIDDEN);
    }
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });

  if (!user) {
    return c.json({ error: 'User lookup failed' }, StatusCodes.INTERNAL_SERVER_ERROR);
  }

  const isAdmin = role === 'admin';
  const { name, verified, profileUrl, avatarUrl, bannerColor } = toUserProfile(user);

  const participantMetadata: ParticipantMetadata = {
    email: email ?? null,
    verified,
    profileUrl,
    avatarUrl,
    bannerColor,
  };

  const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity: userId,
    name,
    metadata: JSON.stringify(participantMetadata),
    ttl: TOKEN_TTL_SECONDS,
  });

  at.addGrant({
    room: room.id,
    roomJoin: true,
    roomCreate: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    canUpdateOwnMetadata: true,
    roomAdmin: isAdmin,
  });

  const payload: TokenResponse = {
    token: await at.toJwt(),
  };

  return c.json(payload, StatusCodes.OK);
};
