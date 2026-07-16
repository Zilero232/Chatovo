import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';
import { isNullish } from 'remeda';

import { RoomKind } from '../../../generated';
import {
  AppForbiddenException,
  AppNotFoundException,
  AppUnauthorizedException,
} from '../../common/exceptions';
import { AppConfigService } from '../../config/config.module';
import { TOKEN_TTL_SECONDS } from '../../config/livekit';
import { PrismaService } from '../../core';
import { toUserProfile } from '../users/profile';

import type { ParticipantMetadata, TokenResponse } from '@chatovo/schemas';
import type { IssueTokenInput } from './livekit.types';

const assertRoomAccess = (
  room: { kind: string; isPrivate: boolean; password: string | null },
  password?: string,
) => {
  if (room.kind === RoomKind.dm) {
    return;
  }

  if (!room.isPrivate) {
    return;
  }

  if (!password) {
    throw new AppUnauthorizedException('ROOM_PASSWORD_REQUIRED', 'Password required');
  }
  if (!room.password) {
    throw new InternalServerErrorException('Room misconfigured');
  }
  if (password !== room.password) {
    throw new AppForbiddenException('ROOM_PASSWORD_INVALID', 'Invalid password');
  }
};

@Injectable()
export class LivekitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
  ) {}

  async issueRoomToken(input: IssueTokenInput): Promise<TokenResponse> {
    const { roomId, password, userId, email, isAdmin } = input;

    const room = await this.prisma.room.findUnique({ where: { id: roomId } });

    if (isNullish(room)) {
      throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
    }

    if (room.kind === RoomKind.dm && room.dmUserAId !== userId && room.dmUserBId !== userId) {
      throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
    }

    assertRoomAccess(room, password);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (isNullish(user)) {
      throw new InternalServerErrorException('User lookup failed');
    }

    const { name, verified, profileUrl, avatarUrl, bannerColor } = toUserProfile(user);

    const participantMetadata: ParticipantMetadata = {
      email,
      verified,
      profileUrl,
      avatarUrl,
      bannerColor,
    };

    const at = new AccessToken(
      this.config.get('LIVEKIT_API_KEY'),
      this.config.get('LIVEKIT_API_SECRET'),
      {
        identity: userId,
        name,
        metadata: JSON.stringify(participantMetadata),
        ttl: TOKEN_TTL_SECONDS,
      },
    );

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
  }
}
