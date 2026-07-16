import { Injectable } from '@nestjs/common';
import { extension } from 'mime-types';

import { AppBadRequestException } from '../../common/exceptions';
import { AVATAR_MAX_BYTES } from '../../config/uploads';
import { PrismaService } from '../../core';
import { ensureUserFriendTag, getUserWithProfileOrThrow } from '../../lib';
import { saveUpload } from '../uploads';
import { toUserProfile } from './profile';

import type { UserProfile } from '@chatovo/schemas';
import type { UpdateProfileInput, UploadedAvatar } from './users.types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async uploadAvatar(userId: string, file: UploadedAvatar): Promise<string> {
    const ext = extension(file.mimetype) || 'png';
    const key = `avatars/${userId}/avatar.${ext}`;
    const buffer = new ArrayBuffer(file.buffer.byteLength);
    new Uint8Array(buffer).set(file.buffer);

    const url = await saveUpload(key, buffer);

    return `${url}?v=${Date.now()}`;
  }

  private async resolveAvatarUrl(
    userId: string,
    avatar: UploadedAvatar | undefined,
    removeAvatar: string | undefined,
  ): Promise<string | null | undefined> {
    if (avatar && avatar.size > 0) {
      if (!avatar.mimetype.startsWith('image/')) {
        throw new AppBadRequestException('FILE_NOT_IMAGE', 'Not an image');
      }
      if (avatar.size > AVATAR_MAX_BYTES) {
        throw new AppBadRequestException('IMAGE_TOO_LARGE', 'Image too large');
      }

      return this.uploadAvatar(userId, avatar);
    }

    if (removeAvatar === 'true') {
      return null;
    }

    return undefined;
  }

  async getUserProfile(id: string): Promise<UserProfile> {
    const user = await getUserWithProfileOrThrow(id);
    const friendTag = await ensureUserFriendTag(user.id, user.name, user.friendTag);

    return toUserProfile({ ...user, friendTag });
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfile> {
    const { displayName, profileUrl, bannerColor, bio, avatar, removeAvatar } = input;

    if (displayName.trim().length < 2) {
      throw new AppBadRequestException('DISPLAY_NAME_INVALID', 'Invalid name');
    }

    const avatarUrl = await this.resolveAvatarUrl(userId, avatar, removeAvatar);

    const profileData = {
      displayName: displayName.trim(),
      profileUrl: profileUrl.trim().length > 0 ? profileUrl.trim() : null,
      bannerColor: bannerColor.length > 0 ? bannerColor : null,
      bio: bio.trim().length > 0 ? bio.trim() : null,
      ...(avatarUrl !== undefined ? { avatarUrl } : {}),
    };

    await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...profileData },
      update: profileData,
    });

    const user = await getUserWithProfileOrThrow(userId);
    const friendTag = await ensureUserFriendTag(user.id, user.name, user.friendTag);

    return toUserProfile({ ...user, friendTag });
  }
}
