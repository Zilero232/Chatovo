import type { ParticipantMetadata, TokenResponse } from '@chatovo/schemas';

import { USER_ROLE } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';
import { isNullish } from 'remeda';

import type { IssueTokenInput } from '../../livekit.types';

import {
  AppForbiddenException,
  AppInternalException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { AppConfigService } from '../../../../config/config.module';
import { TOKEN_TTL_SECONDS } from '../../../../config/livekit';
import { PrismaService } from '../../../../core';
import { assertNotBlocked, canAccessRoom } from '../../../../lib';
import { toUserProfile } from '../../../users';
import { assertRoomAccess, resolveInvisible } from '../../lib';
import { grantRoomAccess } from '../../room-grant-store';

@Injectable()
export class LivekitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService
  ) {}

  async issueRoomToken(input: IssueTokenInput): Promise<TokenResponse> {
    const { roomId, password, userId, invisible } = input;

    await assertNotBlocked(userId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (isNullish(user)) {
      throw new AppInternalException('INTERNAL_ERROR', 'User lookup failed');
    }

    const isAdmin = user.role === USER_ROLE.admin;
    const isInvisible = resolveInvisible({ requested: invisible, isAdmin });

    const room = await this.prisma.room.findUnique({ where: { id: roomId } });

    if (isNullish(room)) {
      throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
    }

    if (!canAccessRoom({ room, userId, tier: 'view' })) {
      throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
    }

    if (!isInvisible) {
      await assertRoomAccess({ room, password });
    }

    grantRoomAccess(room.id, userId);

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
        identity: userId,
        name,
        metadata: JSON.stringify(participantMetadata),
        ttl: TOKEN_TTL_SECONDS
      }
    );

    at.addGrant({
      room: room.id,
      roomJoin: true,
      canPublish: !isInvisible,
      canSubscribe: true,
      canPublishData: !isInvisible,
      canUpdateOwnMetadata: true,
      roomAdmin: isAdmin,
      hidden: isInvisible
    });

    return { token: await at.toJwt() };
  }
}
