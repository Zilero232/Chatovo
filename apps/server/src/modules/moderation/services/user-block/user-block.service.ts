import { USER_ROLE } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isNullish } from 'remeda';

import type { UserBlockedEvent } from '../../../../common/events/domain-events';
import type { BlockUserInput, UnblockUserInput } from '../../moderation.service.types';

import { DomainEvent } from '../../../../common/events/domain-events';
import {
  AppBadRequestException,
  AppForbiddenException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { ejectParticipantEverywhere, revokeUserGrants } from '../../../livekit';
import { BLOCKED_WS_CLOSE_CODE, closeUserConnections } from '../../../realtime';
import { ADMIN_LIST_MAX } from '../../config';
import { adminUserInclude, toAdminUser } from '../../mappers';

@Injectable()
export class UserBlockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2
  ) {}

  async block({ userId, adminId, input }: BlockUserInput) {
    if (userId === adminId) {
      throw new AppBadRequestException('BLOCK_SELF', 'Cannot block yourself');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (isNullish(user)) {
      throw new AppNotFoundException('USER_NOT_FOUND', 'User not found');
    }

    if (user.role === USER_ROLE.admin) {
      throw new AppForbiddenException('BLOCK_ADMIN', 'Cannot block an administrator');
    }

    const blocked = await this.prisma.user.update({
      where: { id: userId },
      data: { blockedAt: new Date(), blockedReason: input.reason, blockedById: adminId },
      include: adminUserInclude
    });

    await this.evict(userId);

    this.events.emit(DomainEvent.UserBlocked, {
      userId,
      userName: user.name,
      email: user.email,
      reason: input.reason,
      blockedBy: adminId
    } satisfies UserBlockedEvent);

    return toAdminUser(blocked);
  }

  async unblock({ userId }: UnblockUserInput) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (isNullish(user)) {
      throw new AppNotFoundException('USER_NOT_FOUND', 'User not found');
    }

    const unblocked = await this.prisma.user.update({
      where: { id: userId },
      data: { blockedAt: null, blockedReason: null, blockedById: null },
      include: adminUserInclude
    });

    return toAdminUser(unblocked);
  }

  async list() {
    const users = await this.prisma.user.findMany({
      where: { blockedAt: { not: null } },
      include: adminUserInclude,
      orderBy: { blockedAt: 'desc' },
      take: ADMIN_LIST_MAX
    });

    return users.map(toAdminUser);
  }

  private async evict(userId: string) {
    revokeUserGrants(userId);
    closeUserConnections(userId, BLOCKED_WS_CLOSE_CODE, 'Account blocked');

    await Promise.allSettled([
      this.prisma.session.deleteMany({ where: { userId } }),
      ejectParticipantEverywhere(userId)
    ]);
  }
}
