import type { Room } from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';

import type { GetOrCreateDmRoomInput } from './dm-room.service.types';

import { RoomKind } from '../../../../../generated';
import { AppBadRequestException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { roomSelect } from '../../../../lib';
import { FriendshipService } from '../friendship';

@Injectable()
export class DmRoomService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly friendship: FriendshipService
  ) {}

  async getOrCreateDmRoom({ userId, otherUserId }: GetOrCreateDmRoomInput): Promise<Room> {
    if (userId === otherUserId) {
      throw new AppBadRequestException('DM_SELF', 'Cannot create DM with yourself');
    }

    await this.friendship.assertAreFriends({ userId, otherUserId });

    const [dmUserAId, dmUserBId] =
      userId < otherUserId ? [userId, otherUserId] : [otherUserId, userId];

    return this.prisma.room.upsert({
      where: {
        kind_dmUserAId_dmUserBId: {
          kind: RoomKind.dm,
          dmUserAId,
          dmUserBId
        }
      },
      create: {
        ownerId: userId,
        name: `dm-${crypto.randomUUID()}`,
        isPrivate: false,
        kind: RoomKind.dm,
        dmUserAId,
        dmUserBId
      },
      update: { isPrivate: false, password: null },
      select: roomSelect
    });
  }
}
