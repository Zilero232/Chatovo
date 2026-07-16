import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isNonNullish } from 'remeda';

import { RoomKind } from '../../../generated';
import { DomainEvent } from '../../common/events/domain-events';
import { AppConflictException } from '../../common/exceptions';
import { PrismaService } from '../../core';
import { assertCanManageRoom, getUserDisplayName, roomSelect } from '../../lib';

import type { CreateRoomRequest, UpdateRoomRequest } from '@chatovo/schemas';
import type { Prisma } from '../../../generated';
import type { RoomCreatedEvent, RoomDeletedEvent } from '../../common/events/domain-events';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2,
  ) {}

  listRooms() {
    return this.prisma.room.findMany({
      where: { kind: RoomKind.group },
      orderBy: { createdAt: 'desc' },
      select: roomSelect,
    });
  }

  getRoom(id: string) {
    return this.prisma.room.findUnique({ where: { id }, select: roomSelect });
  }

  private async assertRoomNameAvailable(name: string) {
    const existing = await this.prisma.room.findUnique({
      where: { name },
      select: { id: true },
    });

    if (existing) {
      throw new AppConflictException('ROOM_NAME_TAKEN', 'A room with this name already exists');
    }
  }

  async createRoom(input: CreateRoomRequest, ownerId: string) {
    const { isPrivate, name, password } = input;

    await this.assertRoomNameAvailable(name);

    const storedPassword = isPrivate ? (password ?? null) : null;

    const room = await this.prisma.room.create({
      data: { name, isPrivate, password: storedPassword, ownerId },
      select: roomSelect,
    });

    const ownerName = await getUserDisplayName(ownerId);

    this.events.emit(DomainEvent.RoomCreated, {
      roomName: room.name,
      ownerName,
      isPrivate: room.isPrivate,
      password: storedPassword,
    } satisfies RoomCreatedEvent);

    return room;
  }

  async updateRoom(id: string, input: UpdateRoomRequest, userId: string) {
    const current = await assertCanManageRoom(id, userId);

    const data: Prisma.RoomUpdateInput = {};

    if (isNonNullish(input.name) && input.name !== current.name) {
      await this.assertRoomNameAvailable(input.name);
      data.name = input.name;
    }

    if (isNonNullish(input.isPrivate)) {
      data.isPrivate = input.isPrivate;

      if (input.isPrivate === false) {
        data.password = null;
      }
    }

    if (isNonNullish(input.password)) {
      const willBePrivate = input.isPrivate ?? current.isPrivate;

      if (willBePrivate) {
        data.password = input.password;
      }
    }

    return this.prisma.room.update({ where: { id }, data, select: roomSelect });
  }

  async deleteRoom(id: string, userId: string) {
    const room = await assertCanManageRoom(id, userId);
    const deleted = await this.prisma.room.delete({
      where: { id },
      select: { name: true },
    });

    const ownerName = await getUserDisplayName(room.ownerId);

    this.events.emit(DomainEvent.RoomDeleted, {
      roomName: deleted.name,
      ownerName,
    } satisfies RoomDeletedEvent);
  }
}
