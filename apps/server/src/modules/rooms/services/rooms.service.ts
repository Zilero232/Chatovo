import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';

import type { GetRoomInput } from './rooms.service.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { assertCanViewRoom, roomSelect } from '../../../lib';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoom({ roomId, userId }: GetRoomInput) {
    await assertCanViewRoom({ roomId, userId });

    const room = await this.prisma.room.findUnique({ where: { id: roomId }, select: roomSelect });

    if (isNullish(room)) {
      throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
    }

    return room;
  }
}
