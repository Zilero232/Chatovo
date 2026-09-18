import type { ParticipantMetadata, TokenResponse } from '@chatovo/schemas';

import { hasPermission, USER_ROLE } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { AccessToken, TrackSource } from 'livekit-server-sdk';
import { isEmpty, isNonNullish, isNullish } from 'remeda';

import type {
  BuildAccessTokenInput,
  IssueTokenInput,
  LoadAccessibleRoomInput
} from '../../livekit.types';

import { ChannelType } from '../../../../../generated';
import {
  AppBadRequestException,
  AppForbiddenException,
  AppInternalException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { AppConfigService } from '../../../../config/config.module';
import { TOKEN_TTL_SECONDS } from '../../../../config/livekit';
import { PrismaService } from '../../../../core';
import {
  assertNotBlocked,
  assertNotTimedOut,
  canAccessRoom,
  resolveChannelPermissions
} from '../../../../lib';
import { toUserProfile } from '../../../users';
import { resolveInvisible } from '../../lib';
import { grantRoomAccess } from '../../room-grant-store';

@Injectable()
export class LivekitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService
  ) {}

  async issueRoomToken({ roomId, userId, invisible }: IssueTokenInput): Promise<TokenResponse> {
    await assertNotBlocked(userId);

    const user = await this.loadUserOrThrow(userId);

    const isAdmin = user.role === USER_ROLE.admin;
    const isInvisible = resolveInvisible({ requested: invisible, isAdmin });

    const { room, permissions } = await this.loadAccessibleRoomOrThrow({ roomId, userId });

    grantRoomAccess(room.id, userId);

    const token = await this.buildAccessToken({
      user,
      roomId: room.id,
      isAdmin,
      isInvisible,
      canPublishAudio: isNullish(permissions) || hasPermission(permissions, 'speak'),
      canPublishVideo: isNullish(permissions) || hasPermission(permissions, 'stream')
    });

    return { token };
  }

  private async loadUserOrThrow(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (isNullish(user)) {
      throw new AppInternalException('INTERNAL_ERROR', 'User lookup failed');
    }

    return user;
  }

  private async loadAccessibleRoomOrThrow({ roomId, userId }: LoadAccessibleRoomInput) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });

    if (isNullish(room)) {
      throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
    }

    if (isNonNullish(room.serverId)) {
      const permissions = await this.assertCanConnectToChannel({
        room,
        serverId: room.serverId,
        userId
      });

      return { room, permissions };
    }

    if (!canAccessRoom({ room, userId })) {
      throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
    }

    return { room, permissions: null };
  }

  private async assertCanConnectToChannel({
    room,
    serverId,
    userId
  }: {
    room: { id: string; type: ChannelType };
    serverId: string;
    userId: string;
  }) {
    if (room.type !== ChannelType.voice) {
      throw new AppBadRequestException('CHANNEL_TYPE_MISMATCH', 'Not a voice channel');
    }

    await assertNotTimedOut({ serverId, userId });

    const permissions = await resolveChannelPermissions({ serverId, userId, channelId: room.id });

    if (!hasPermission(permissions, 'connect')) {
      throw new AppForbiddenException('PERMISSION_DENIED', 'Cannot connect to this channel');
    }

    return permissions;
  }

  private async buildAccessToken({
    user,
    roomId,
    isAdmin,
    isInvisible,
    canPublishAudio,
    canPublishVideo
  }: BuildAccessTokenInput) {
    const { name, verified, developer, profileUrl, avatarUrl, bannerColor } = toUserProfile(user);

    const participantMetadata = {
      verified,
      developer,
      profileUrl,
      avatarUrl,
      bannerColor,
      invisible: isInvisible
    } satisfies ParticipantMetadata & { invisible: boolean };

    const at = new AccessToken(
      this.config.get('LIVEKIT_API_KEY'),
      this.config.get('LIVEKIT_API_SECRET'),
      {
        identity: user.id,
        name,
        metadata: JSON.stringify(participantMetadata),
        ttl: TOKEN_TTL_SECONDS
      }
    );

    const publishSources = [
      ...(canPublishAudio ? [TrackSource.MICROPHONE] : []),
      ...(canPublishVideo ? [TrackSource.CAMERA, TrackSource.SCREEN_SHARE] : [])
    ];

    at.addGrant({
      room: roomId,
      roomJoin: true,
      canPublish: !isInvisible && !isEmpty(publishSources),
      canPublishSources: publishSources,
      canSubscribe: true,
      canPublishData: !isInvisible,
      canUpdateOwnMetadata: true,
      roomAdmin: isAdmin,
      hidden: isInvisible
    });

    return at.toJwt();
  }
}
