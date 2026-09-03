import { Module } from '@nestjs/common';

import { ModerationController } from './moderation.controller';
import {
  AbuseReportService,
  AdminRoomService,
  AdminStatsService,
  AdminUserService,
  UserBlockService
} from './services';

@Module({
  controllers: [ModerationController],
  providers: [
    AbuseReportService,
    AdminRoomService,
    AdminStatsService,
    AdminUserService,
    UserBlockService
  ],
  exports: [UserBlockService]
})
export class ModerationModule {}
