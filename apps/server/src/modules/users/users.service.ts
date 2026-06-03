import { HTTPException } from 'hono/http-exception';
import { StatusCodes } from 'http-status-codes';
import { extension } from 'mime-types';
import { AVATAR_MAX_BYTES } from '../../config/uploads';
import { prisma } from '../../core';
import { getUserWithProfileOrThrow } from '../../lib';
import { saveUpload } from '../uploads';
import { toUserProfile } from './profile';
import type { UserProfile } from '@chatovo/schemas';

type UpdateProfileInput = {
  displayName: string;
  profileUrl: string;
  bannerColor: string;
  bio: string;
  avatar?: File;
  removeAvatar?: string;
};

const uploadAvatar = async (userId: string, file: File): Promise<string> => {
  const ext = extension(file.type) || 'png';
  const key = `avatars/${userId}/avatar.${ext}`;
  const buffer = await file.arrayBuffer();

  const url = await saveUpload(key, buffer);

  return `${url}?v=${Date.now()}`;
};

const resolveAvatarUrl = async (
  userId: string,
  avatar: File | undefined,
  removeAvatar: string | undefined,
): Promise<string | null | undefined> => {
  if (avatar instanceof File && avatar.size > 0) {
    if (!avatar.type.startsWith('image/')) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, { message: 'Not an image' });
    }
    if (avatar.size > AVATAR_MAX_BYTES) {
      throw new HTTPException(StatusCodes.BAD_REQUEST, { message: 'Image too large' });
    }

    return uploadAvatar(userId, avatar);
  }

  if (removeAvatar === 'true') {
    return null;
  }

  return undefined;
};

export const getUserProfile = async (id: string): Promise<UserProfile> => {
  const user = await getUserWithProfileOrThrow(id);

  return toUserProfile(user);
};

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput,
): Promise<UserProfile> => {
  const { displayName, profileUrl, bannerColor, bio, avatar, removeAvatar } = input;

  if (displayName.trim().length < 2) {
    throw new HTTPException(StatusCodes.BAD_REQUEST, { message: 'Invalid name' });
  }

  const avatarUrl = await resolveAvatarUrl(userId, avatar, removeAvatar);

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

  const user = await getUserWithProfileOrThrow(userId);

  return toUserProfile(user);
};
