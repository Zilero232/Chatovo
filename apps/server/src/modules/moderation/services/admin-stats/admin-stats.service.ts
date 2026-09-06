import { USER_ROLE } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { startOfDay, subDays } from 'date-fns';

import { PrismaService } from '../../../../core';
import { getSnapshot } from '../../../livekit';
import { SERIES_DAYS } from '../../config';
import { toDaySeries } from '../../lib';

@Injectable()
export class AdminStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async read() {
    const now = new Date();
    const today = startOfDay(now);
    const weekAgo = subDays(today, 7);
    const seriesFrom = subDays(today, SERIES_DAYS - 1);

    const snapshot = getSnapshot();

    const [
      totalUsers,
      blockedUsers,
      admins,
      newToday,
      newThisWeek,
      totalRooms,
      groupRooms,
      privateRooms,
      totalMessages,
      messagesToday,
      messagesThisWeek,
      pendingReports,
      handledReports,
      signupRows,
      messageRows
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { blockedAt: { not: null } } }),
      this.prisma.user.count({ where: { role: USER_ROLE.admin } }),
      this.prisma.user.count({ where: { createdAt: { gte: today } } }),
      this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      this.prisma.room.count(),
      this.prisma.room.count({ where: { kind: 'group' } }),
      this.prisma.room.count({ where: { isPrivate: true } }),
      this.prisma.message.count({ where: { deletedAt: null } }),
      this.prisma.message.count({ where: { deletedAt: null, createdAt: { gte: today } } }),
      this.prisma.message.count({ where: { deletedAt: null, createdAt: { gte: weekAgo } } }),
      this.prisma.abuseReport.count({ where: { handled: false } }),
      this.prisma.abuseReport.count({ where: { handled: true } }),
      this.prisma.user.findMany({
        where: { createdAt: { gte: seriesFrom } },
        select: { createdAt: true }
      }),
      this.prisma.message.findMany({
        where: { deletedAt: null, createdAt: { gte: seriesFrom } },
        select: { createdAt: true }
      })
    ]);

    return {
      users: {
        total: totalUsers,
        online: snapshot.lobbyOnline,
        blocked: blockedUsers,
        admins,
        newToday,
        newThisWeek
      },
      rooms: {
        total: totalRooms,
        group: groupRooms,
        dm: totalRooms - groupRooms,
        private: privateRooms,
        liveNow: Object.keys(snapshot.rooms).length
      },
      messages: { total: totalMessages, today: messagesToday, thisWeek: messagesThisWeek },
      reports: { pending: pendingReports, handled: handledReports },
      signups: toDaySeries({ rows: signupRows, from: seriesFrom, days: SERIES_DAYS }),
      messagesSeries: toDaySeries({ rows: messageRows, from: seriesFrom, days: SERIES_DAYS })
    };
  }
}
