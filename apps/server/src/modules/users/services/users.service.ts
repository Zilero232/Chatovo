import type { UserProfile } from '@chatovo/schemas';

import { AVATAR_MAX_BYTES, userRoleSchema } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { extension } from 'mime-types';

import type {
  ResolveAvatarUrlInput,
  UpdateUserProfileInput,
  UploadAvatarInput
} from './users.service.types';

import { AppBadRequestException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { ensureUserFriendTag, getUserWithProfileOrThrow } from '../../../lib';
import { saveUpload, toArrayBuffer } from '../../uploads';
import { toUserProfile } from '../profile';

const USER_ROLE = userRoleSchema.enum;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private async uploadAvatar({ userId, file }: UploadAvatarInput): Promise<string> {
    const ext = extension(file.mimetype) || 'png';
    const key = `avatars/${userId}/avatar.${ext}`;

    const url = await saveUpload(key, toArrayBuffer(file.buffer));

    return `${url}?v=${Date.now()}`;
  }

  private async resolveAvatarUrl({
    userId,
    avatar,
    removeAvatar
  }: ResolveAvatarUrlInput): Promise<string | null | undefined> {
    if (avatar && avatar.size > 0) {
      if (!avatar.mimetype.startsWith('image/')) {
        throw new AppBadRequestException('FILE_NOT_IMAGE', 'Not an image');
      }

      if (avatar.size > AVATAR_MAX_BYTES) {
        throw new AppBadRequestException('IMAGE_TOO_LARGE', 'Image too large');
      }

      return this.uploadAvatar({ userId, file: avatar });
    }

    if (removeAvatar === 'true') {
      return null;
    }

    return undefined;
  }

  async listDevelopers(): Promise<UserProfile[]> {
    const users = await this.prisma.user.findMany({
      where: { role: USER_ROLE.admin },
      include: { profile: true },
      orderBy: { createdAt: 'asc' }
    });

    return users.map(toUserProfile);
  }

  async getUserProfile(id: string): Promise<UserProfile> {
    const user = await getUserWithProfileOrThrow(id);
    const friendTag = await ensureUserFriendTag({
      userId: user.id,
      name: user.name,
      currentFriendTag: user.friendTag
    });

    return toUserProfile({ ...user, friendTag });
  }

  async updateProfile({ userId, input }: UpdateUserProfileInput): Promise<UserProfile> {
    const { displayName, profileUrl, bannerColor, bio, avatar, removeAvatar } = input;

    const avatarUrl = await this.resolveAvatarUrl({ userId, avatar, removeAvatar });

    const profileData = {
      displayName: displayName.trim(),
      profileUrl: profileUrl.trim().length > 0 ? profileUrl.trim() : null,
      bannerColor: bannerColor.length > 0 ? bannerColor : null,
      bio: bio.trim().length > 0 ? bio.trim() : null,
      ...(avatarUrl !== undefined ? { avatarUrl } : {})
    };

    await this.prisma.profile.upsert({
      where: { userId },
      create: { userId, ...profileData },
      update: profileData
    });

    return this.getUserProfile(userId);
  }
}
