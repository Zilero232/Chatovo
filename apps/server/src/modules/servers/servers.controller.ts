import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import type { UploadedServerIcon } from './services/servers';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  BanMemberDto,
  CreateInviteDto,
  CreateRoleDto,
  CreateServerDto,
  JoinServerDto,
  ReorderRolesDto,
  ServerBanDto,
  ServerDto,
  ServerInviteDto,
  ServerInvitePreviewDto,
  ServerMemberDto,
  ServerRoleDto,
  UpdateMemberDto,
  UpdateRoleDto,
  UpdateServerDto
} from './dto/servers.dto';
import {
  BansService,
  InvitesService,
  MembersService,
  RolesService,
  ServersService
} from './services';

@ApiTags('servers')
@Controller('servers')
export class ServersController {
  constructor(
    private readonly servers: ServersService,
    private readonly members: MembersService,
    private readonly roles: RolesService,
    private readonly invites: InvitesService,
    private readonly bans: BansService
  ) {}

  @Get()
  @ZodResponse({ type: [ServerDto] })
  listServers(@CurrentUser() userId: string) {
    return this.servers.listServers(userId);
  }

  @Post()
  @ZodResponse({ status: 201, type: ServerDto })
  createServer(@Body() body: CreateServerDto, @CurrentUser() userId: string) {
    return this.servers.createServer({ input: body, ownerId: userId });
  }

  @Get('invites/:code')
  @ZodResponse({ type: ServerInvitePreviewDto })
  previewInvite(@Param('code') code: string, @CurrentUser() userId: string) {
    return this.invites.previewInvite({ code, userId });
  }

  @Post('join')
  @ZodResponse({ type: ServerDto })
  joinServer(@Body() body: JoinServerDto, @CurrentUser() userId: string) {
    return this.invites.joinServer({ code: body.code, userId });
  }

  @Get(':id')
  @ZodResponse({ type: ServerDto })
  getServer(@Param('id') serverId: string, @CurrentUser() userId: string) {
    return this.servers.getServer({ serverId, userId });
  }

  @Patch(':id')
  @ZodResponse({ type: ServerDto })
  updateServer(
    @Param('id') serverId: string,
    @Body() body: UpdateServerDto,
    @CurrentUser() userId: string
  ) {
    return this.servers.updateServer({ serverId, input: body, userId });
  }

  @Post(':id/icon')
  @UseInterceptors(FileInterceptor('icon'))
  @ZodResponse({ type: ServerDto })
  updateIcon(
    @Param('id') serverId: string,
    @UploadedFile() icon: UploadedServerIcon | undefined,
    @CurrentUser() userId: string
  ) {
    if (!icon) {
      return this.servers.removeIcon({ serverId, userId });
    }

    return this.servers.updateIcon({
      serverId,
      userId,
      file: { mimetype: icon.mimetype, size: icon.size, buffer: icon.buffer }
    });
  }

  @Delete(':id/icon')
  @ZodResponse({ type: ServerDto })
  removeIcon(@Param('id') serverId: string, @CurrentUser() userId: string) {
    return this.servers.removeIcon({ serverId, userId });
  }

  @Get(':id/bans')
  @ZodResponse({ type: [ServerBanDto] })
  listBans(@Param('id') serverId: string, @CurrentUser() userId: string) {
    return this.bans.listBans({ serverId, userId });
  }

  @Post(':id/bans/:memberUserId')
  @ZodResponse({ status: 201, type: ServerBanDto })
  banMember(
    @Param('id') serverId: string,
    @Param('memberUserId') targetUserId: string,
    @Body() body: BanMemberDto,
    @CurrentUser() userId: string
  ) {
    return this.bans.banMember({ serverId, targetUserId, input: body, userId });
  }

  @Delete(':id/bans/:memberUserId')
  @HttpCode(204)
  unbanMember(
    @Param('id') serverId: string,
    @Param('memberUserId') targetUserId: string,
    @CurrentUser() userId: string
  ) {
    return this.bans.unbanMember({ serverId, targetUserId, userId });
  }

  @Delete(':id')
  @HttpCode(204)
  deleteServer(@Param('id') serverId: string, @CurrentUser() userId: string) {
    return this.servers.deleteServer({ serverId, userId });
  }

  @Post(':id/leave')
  @HttpCode(204)
  leaveServer(@Param('id') serverId: string, @CurrentUser() userId: string) {
    return this.servers.leaveServer({ serverId, userId });
  }

  @Post(':id/transfer/:userId')
  @ZodResponse({ type: ServerDto })
  transferOwnership(
    @Param('id') serverId: string,
    @Param('userId') targetUserId: string,
    @CurrentUser() userId: string
  ) {
    return this.servers.transferOwnership({ serverId, targetUserId, userId });
  }

  @Get(':id/members')
  @ZodResponse({ type: [ServerMemberDto] })
  listMembers(@Param('id') serverId: string, @CurrentUser() userId: string) {
    return this.members.listMembers({ serverId, userId });
  }

  @Patch(':id/members/:memberUserId')
  @ZodResponse({ type: ServerMemberDto })
  updateMember(
    @Param('id') serverId: string,
    @Param('memberUserId') targetUserId: string,
    @Body() body: UpdateMemberDto,
    @CurrentUser() userId: string
  ) {
    return this.members.updateMember({ serverId, targetUserId, input: body, userId });
  }

  @Delete(':id/members/:memberUserId')
  @HttpCode(204)
  kickMember(
    @Param('id') serverId: string,
    @Param('memberUserId') targetUserId: string,
    @CurrentUser() userId: string
  ) {
    return this.members.kickMember({ serverId, targetUserId, userId });
  }

  @Get(':id/roles')
  @ZodResponse({ type: [ServerRoleDto] })
  listRoles(@Param('id') serverId: string, @CurrentUser() userId: string) {
    return this.roles.listRoles({ serverId, userId });
  }

  @Post(':id/roles')
  @ZodResponse({ status: 201, type: ServerRoleDto })
  createRole(
    @Param('id') serverId: string,
    @Body() body: CreateRoleDto,
    @CurrentUser() userId: string
  ) {
    return this.roles.createRole({ serverId, input: body, userId });
  }

  @Patch(':id/roles/reorder')
  @ZodResponse({ type: [ServerRoleDto] })
  reorderRoles(
    @Param('id') serverId: string,
    @Body() body: ReorderRolesDto,
    @CurrentUser() userId: string
  ) {
    return this.roles.reorderRoles({ serverId, input: body, userId });
  }

  @Patch(':id/roles/:roleId')
  @ZodResponse({ type: ServerRoleDto })
  updateRole(
    @Param('id') serverId: string,
    @Param('roleId') roleId: string,
    @Body() body: UpdateRoleDto,
    @CurrentUser() userId: string
  ) {
    return this.roles.updateRole({ serverId, roleId, input: body, userId });
  }

  @Delete(':id/roles/:roleId')
  @HttpCode(204)
  deleteRole(
    @Param('id') serverId: string,
    @Param('roleId') roleId: string,
    @CurrentUser() userId: string
  ) {
    return this.roles.deleteRole({ serverId, roleId, userId });
  }

  @Get(':id/invites')
  @ZodResponse({ type: [ServerInviteDto] })
  listInvites(@Param('id') serverId: string, @CurrentUser() userId: string) {
    return this.invites.listInvites({ serverId, userId });
  }

  @Post(':id/invites')
  @ZodResponse({ status: 201, type: ServerInviteDto })
  createInvite(
    @Param('id') serverId: string,
    @Body() body: CreateInviteDto,
    @CurrentUser() userId: string
  ) {
    return this.invites.createInvite({ serverId, input: body, userId });
  }

  @Delete(':id/invites/:inviteId')
  @HttpCode(204)
  revokeInvite(
    @Param('id') serverId: string,
    @Param('inviteId') inviteId: string,
    @CurrentUser() userId: string
  ) {
    return this.invites.revokeInvite({ serverId, inviteId, userId });
  }
}
