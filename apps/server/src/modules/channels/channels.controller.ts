import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  ChannelDto,
  ChannelOverwriteDto,
  ChannelReadStateDto,
  CreateThreadDto,
  CreateThreadTagDto,
  MarkChannelReadDto,
  MuteChannelDto,
  PutOverwriteDto,
  ThreadDto,
  ThreadTagDto,
  UpdateChannelDto,
  VoiceChannelRefDto
} from './dto/channels.dto';
import { ChannelsService, OverwritesService, ReadStateService, ThreadsService } from './services';

@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(
    private readonly channels: ChannelsService,
    private readonly overwrites: OverwritesService,
    private readonly threads: ThreadsService,
    private readonly readState: ReadStateService
  ) {}

  @Get('voice')
  @ZodResponse({ type: [VoiceChannelRefDto] })
  listVoiceChannels(@CurrentUser() userId: string) {
    return this.channels.listVoiceChannels(userId);
  }

  @Get(':id')
  @ZodResponse({ type: ChannelDto })
  getChannel(@Param('id') channelId: string, @CurrentUser() userId: string) {
    return this.channels.getChannel({ channelId, userId });
  }

  @Patch(':id')
  @ZodResponse({ type: ChannelDto })
  updateChannel(
    @Param('id') channelId: string,
    @Body() body: UpdateChannelDto,
    @CurrentUser() userId: string
  ) {
    return this.channels.updateChannel({ channelId, input: body, userId });
  }

  @Delete(':id')
  @HttpCode(204)
  deleteChannel(@Param('id') channelId: string, @CurrentUser() userId: string) {
    return this.channels.deleteChannel({ channelId, userId });
  }

  @Get(':id/overwrites')
  @ZodResponse({ type: [ChannelOverwriteDto] })
  listOverwrites(@Param('id') channelId: string, @CurrentUser() userId: string) {
    return this.overwrites.listOverwrites({ channelId, userId });
  }

  @Post(':id/overwrites')
  @ZodResponse({ type: ChannelOverwriteDto })
  putOverwrite(
    @Param('id') channelId: string,
    @Body() body: PutOverwriteDto,
    @CurrentUser() userId: string
  ) {
    return this.overwrites.putOverwrite({ channelId, input: body, userId });
  }

  @Delete(':id/overwrites/:overwriteId')
  @HttpCode(204)
  deleteOverwrite(
    @Param('id') channelId: string,
    @Param('overwriteId') overwriteId: string,
    @CurrentUser() userId: string
  ) {
    return this.overwrites.deleteOverwrite({ channelId, overwriteId, userId });
  }

  @Get(':id/threads')
  @ZodResponse({ type: [ThreadDto] })
  listThreads(
    @Param('id') channelId: string,
    @Query('archived') archived: string | undefined,
    @CurrentUser() userId: string
  ) {
    return this.threads.listThreads({ channelId, userId, includeArchived: archived === 'true' });
  }

  @Post(':id/threads')
  @ZodResponse({ status: 201, type: ThreadDto })
  createThread(
    @Param('id') channelId: string,
    @Body() body: CreateThreadDto,
    @CurrentUser() userId: string
  ) {
    return this.threads.createThread({ channelId, input: body, userId });
  }

  @Get(':id/thread-tags')
  @ZodResponse({ type: [ThreadTagDto] })
  listThreadTags(@Param('id') channelId: string, @CurrentUser() userId: string) {
    return this.threads.listThreadTags({ channelId, userId });
  }

  @Post(':id/thread-tags')
  @ZodResponse({ status: 201, type: ThreadTagDto })
  createThreadTag(
    @Param('id') channelId: string,
    @Body() body: CreateThreadTagDto,
    @CurrentUser() userId: string
  ) {
    return this.threads.createThreadTag({ channelId, input: body, userId });
  }

  @Post(':id/read')
  @ZodResponse({ type: ChannelReadStateDto })
  markChannelRead(
    @Param('id') channelId: string,
    @Body() body: MarkChannelReadDto,
    @CurrentUser() userId: string
  ) {
    return this.readState.markChannelRead({ channelId, input: body, userId });
  }

  @Post(':id/mute')
  @ZodResponse({ type: ChannelReadStateDto })
  muteChannel(
    @Param('id') channelId: string,
    @Body() body: MuteChannelDto,
    @CurrentUser() userId: string
  ) {
    return this.readState.muteChannel({ channelId, mutedUntil: body.mutedUntil, userId });
  }
}
