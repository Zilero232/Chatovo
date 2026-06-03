import { StatusCodes } from 'http-status-codes';
import { extension } from 'mime-types';
import { AVATAR_MAX_BYTES } from '../../config/uploads';
import { prisma } from '../../core';
import { saveUpload } from '../uploads';
import { toUserProfile } from './profile';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { getUserProfileRoute, updateProfileRoute } from './routes';

export const getUserProfileHandler: RouteHandler<typeof getUserProfileRoute, Env> = async (c) => {
  const { id } = c.req.valid('param');

  const user = await prisma.user.findUnique({ where: { id }, include: { profile: true } });

  if (!user) {
    return c.json({ error: 'User not found' }, StatusCodes.NOT_FOUND);
  }

  return c.json(toUserProfile(user), StatusCodes.OK);
};

const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const ext = extension(file.type) || 'png';
  const key = `avatars/${userId}/avatar.${ext}`;
  const buffer = await file.arrayBuffer();

  const url = await saveUpload(key, buffer);

  return `${url}?v=${Date.now()}`;
};

export const updateProfileHandler: RouteHandler<typeof updateProfileRoute, Env> = async (c) => {
  const userId = c.get('userId');
  const { displayName, profileUrl, bannerColor, bio, avatar, removeAvatar } = c.req.valid('form');

  if (displayName.trim().length < 2) {
    return c.json({ error: 'Invalid name' }, StatusCodes.BAD_REQUEST);
  }

  let avatarUrl: string | null | undefined;

  if (avatar instanceof File && avatar.size > 0) {
    const { type, size } = avatar;

    if (!type.startsWith('image/')) {
      return c.json({ error: 'Not an image' }, StatusCodes.BAD_REQUEST);
    }
    if (size > AVATAR_MAX_BYTES) {
      return c.json({ error: 'Image too large' }, StatusCodes.BAD_REQUEST);
    }

    avatarUrl = await uploadAvatar(userId, avatar);
  } else if (removeAvatar === 'true') {
    avatarUrl = null;
  }

  const profileData = {
    displayName: displayName.trim(),
    profileUrl: profileUrl.trim().length > 0 ? profileUrl.trim() : null,
    bannerColor: bannerColor.length > 0 ? bannerColor : null,
    bio: bio.trim().length > 0 ? bio.trim() : null,
    ...(avatarUrl !== undefined ? { avatarUrl } : {}),
  };

  await prisma.profile.upsert({
    where: { userId },
    create: { userId, ...profileData },
    update: profileData,
  });

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });

  if (!user) {
    return c.json({ error: 'User not found' }, StatusCodes.NOT_FOUND);
  }

  return c.json(toUserProfile(user), StatusCodes.OK);
};
