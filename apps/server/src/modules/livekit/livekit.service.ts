import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { AccessToken } from 'livekit-server-sdk';
import { isNullish } from 'remeda';
import { TOKEN_TTL_SECONDS } from '../../config/livekit';
import { env, prisma } from '../../core';
import { toUserProfile } from '../users/profile';
import type { ParticipantMetadata, TokenResponse } from '@chatovo/schemas';

type IssueTokenInput = {
  roomId: string;
  password?: string;
  userId: string;
  email: string | null;
  isAdmin: boolean;
};

const assertRoomAccess = (
  room: { kind: string; isPrivate: boolean; password: string | null },
  password?: string,
) => {
  if (room.kind === 'dm') {
    return;
  }

  if (!room.isPrivate) {
    return;
  }

  if (!password) {
    throw new HTTPException(StatusCodes.UNAUTHORIZED, { message: 'Password required' });
  }
  if (!room.password) {
    throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, { message: 'Room misconfigured' });
  }
  if (password !== room.password) {
    throw new HTTPException(StatusCodes.FORBIDDEN, { message: 'Invalid password' });
  }
};

export const issueRoomToken = async (input: IssueTokenInput): Promise<TokenResponse> => {
  const { roomId, password, userId, email, isAdmin } = input;

  const room = await prisma.room.findUnique({ where: { id: roomId } });

  if (isNullish(room)) {
    throw new HTTPException(StatusCodes.NOT_FOUND, { message: 'Room not found' });
  }

  if (room.kind === 'dm' && room.dmUserAId !== userId && room.dmUserBId !== userId) {
    throw new HTTPException(StatusCodes.FORBIDDEN, { message: 'Forbidden' });
  }

  assertRoomAccess(room, password);

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });

  if (isNullish(user)) {
    throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, { message: 'User lookup failed' });
  }

  const { name, verified, profileUrl, avatarUrl, bannerColor } = toUserProfile(user);

  const participantMetadata: ParticipantMetadata = {
    email,
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
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    canUpdateOwnMetadata: true,
    roomAdmin: isAdmin,
  });

  return { token: await at.toJwt() };
};
