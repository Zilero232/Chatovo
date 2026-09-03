import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ABUSE_REPORT_RATE_LIMIT } from './config';
import {
  AbuseReportDto,
  AbuseReportListDto,
  AdminReportQueryDto,
  AdminRoomListDto,
  AdminRoomQueryDto,
  AdminStatsDto,
  AdminUserDetailsDto,
  AdminUserDto,
  AdminUserListDto,
  AdminUserMessageListDto,
  AdminUserMessageQueryDto,
  AdminUserQueryDto,
  BlockedUserListDto,
  BlockUserDto,
  OkResultDto,
  ReportAbuseDto,
  UpdateAdminUserDto
} from './dto/moderation.dto';
import {
  AbuseReportService,
  AdminRoomService,
  AdminStatsService,
  AdminUserService,
  UserBlockService
} from './services';

@ApiTags('moderation')
@Controller('moderation')
export class ModerationController {
  constructor(
    private readonly reports: AbuseReportService,
    private readonly blocks: UserBlockService,
    private readonly users: AdminUserService,
    private readonly rooms: AdminRoomService,
    private readonly stats: AdminStatsService
  ) {}

  @Post('reports')
  @HttpCode(200)
  @Throttle({ default: ABUSE_REPORT_RATE_LIMIT })
  @ZodResponse({ type: AbuseReportDto })
  async report(@Body() body: ReportAbuseDto, @CurrentUser() userId: string) {
    return this.reports.report({ input: body, reporterId: userId });
  }

  @Get('reports')
  @ZodResponse({ type: AbuseReportListDto })
  async listReports(@Query() query: AdminReportQueryDto, @CurrentUser() userId: string) {
    return this.reports.list({ adminId: userId, query });
  }

  @Post('reports/:reportId/resolve')
  @HttpCode(200)
  @ZodResponse({ type: AbuseReportDto })
  async resolveReport(@Param('reportId') reportId: string, @CurrentUser() userId: string) {
    return this.reports.resolve({ reportId, adminId: userId });
  }

  @Get('stats')
  @ZodResponse({ type: AdminStatsDto })
  async readStats(@CurrentUser() userId: string) {
    return this.stats.read(userId);
  }

  @Get('users')
  @ZodResponse({ type: AdminUserListDto })
  async listUsers(@Query() query: AdminUserQueryDto, @CurrentUser() userId: string) {
    return this.users.list({ adminId: userId, query });
  }

  @Get('users/:targetId')
  @ZodResponse({ type: AdminUserDto })
  async getUser(@Param('targetId') targetId: string, @CurrentUser() userId: string) {
    return this.users.get({ adminId: userId, userId: targetId });
  }

  @Get('users/:targetId/details')
  @ZodResponse({ type: AdminUserDetailsDto })
  async getUserDetails(@Param('targetId') targetId: string, @CurrentUser() userId: string) {
    return this.users.details({ adminId: userId, userId: targetId });
  }

  @Get('users/:targetId/messages')
  @ZodResponse({ type: AdminUserMessageListDto })
  async getUserMessages(
    @Param('targetId') targetId: string,
    @Query() query: AdminUserMessageQueryDto,
    @CurrentUser() userId: string
  ) {
    return this.users.messages({ adminId: userId, userId: targetId, query });
  }

  @Patch('users/:targetId')
  @ZodResponse({ type: AdminUserDto })
  async updateUser(
    @Param('targetId') targetId: string,
    @Body() body: UpdateAdminUserDto,
    @CurrentUser() userId: string
  ) {
    return this.users.update({ adminId: userId, userId: targetId, input: body });
  }

  @Get('rooms')
  @ZodResponse({ type: AdminRoomListDto })
  async listRooms(@Query() query: AdminRoomQueryDto, @CurrentUser() userId: string) {
    return this.rooms.list({ adminId: userId, query });
  }

  @Delete('rooms/:roomId')
  @HttpCode(200)
  @ZodResponse({ type: OkResultDto })
  async deleteRoom(@Param('roomId') roomId: string, @CurrentUser() userId: string) {
    await this.rooms.remove({ adminId: userId, roomId });

    return { ok: true };
  }

  @Get('blocks')
  @ZodResponse({ type: BlockedUserListDto })
  async listBlocked(@CurrentUser() userId: string) {
    return this.blocks.list(userId);
  }

  @Post('blocks/:targetId')
  @HttpCode(200)
  @ZodResponse({ type: AdminUserDto })
  async block(
    @Param('targetId') targetId: string,
    @Body() body: BlockUserDto,
    @CurrentUser() userId: string
  ) {
    return this.blocks.block({ userId: targetId, adminId: userId, input: body });
  }

  @Post('blocks/:targetId/remove')
  @HttpCode(200)
  @ZodResponse({ type: AdminUserDto })
  async unblock(@Param('targetId') targetId: string, @CurrentUser() userId: string) {
    return this.blocks.unblock({ userId: targetId, adminId: userId });
  }
}
