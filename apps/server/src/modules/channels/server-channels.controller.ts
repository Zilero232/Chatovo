import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CategoryDto,
  ChannelDto,
  ChannelOverwriteDto,
  ChannelReadStateDto,
  ChannelTreeDto,
  CreateCategoryDto,
  CreateChannelDto,
  PutOverwriteDto,
  ReorderCategoriesDto,
  ReorderChannelsDto,
  ReorderResultDto,
  UpdateCategoryDto
} from './dto/channels.dto';
import {
  CategoriesService,
  ChannelsService,
  OverwritesService,
  ReadStateService
} from './services';

@ApiTags('servers')
@Controller('servers/:serverId')
export class ServerChannelsController {
  constructor(
    private readonly channels: ChannelsService,
    private readonly categories: CategoriesService,
    private readonly overwrites: OverwritesService,
    private readonly readState: ReadStateService
  ) {}

  @Get('tree')
  @ZodResponse({ type: ChannelTreeDto })
  getChannelTree(@Param('serverId') serverId: string, @CurrentUser() userId: string) {
    return this.channels.getChannelTree({ serverId, userId });
  }

  @Post('channels')
  @ZodResponse({ status: 201, type: ChannelDto })
  createChannel(
    @Param('serverId') serverId: string,
    @Body() body: CreateChannelDto,
    @CurrentUser() userId: string
  ) {
    return this.channels.createChannel({ serverId, input: body, userId });
  }

  @Patch('channels/reorder')
  @ZodResponse({ type: ReorderResultDto })
  reorderChannels(
    @Param('serverId') serverId: string,
    @Body() body: ReorderChannelsDto,
    @CurrentUser() userId: string
  ) {
    return this.channels.reorderChannels({ serverId, input: body, userId });
  }

  @Post('categories')
  @ZodResponse({ status: 201, type: CategoryDto })
  createCategory(
    @Param('serverId') serverId: string,
    @Body() body: CreateCategoryDto,
    @CurrentUser() userId: string
  ) {
    return this.categories.createCategory({ serverId, input: body, userId });
  }

  @Patch('categories/reorder')
  @ZodResponse({ type: [CategoryDto] })
  reorderCategories(
    @Param('serverId') serverId: string,
    @Body() body: ReorderCategoriesDto,
    @CurrentUser() userId: string
  ) {
    return this.categories.reorderCategories({ serverId, input: body, userId });
  }

  @Patch('categories/:categoryId')
  @ZodResponse({ type: CategoryDto })
  updateCategory(
    @Param('serverId') serverId: string,
    @Param('categoryId') categoryId: string,
    @Body() body: UpdateCategoryDto,
    @CurrentUser() userId: string
  ) {
    return this.categories.updateCategory({ serverId, categoryId, input: body, userId });
  }

  @Delete('categories/:categoryId')
  @HttpCode(204)
  deleteCategory(
    @Param('serverId') serverId: string,
    @Param('categoryId') categoryId: string,
    @CurrentUser() userId: string
  ) {
    return this.categories.deleteCategory({ serverId, categoryId, userId });
  }

  @Get('categories/:categoryId/overwrites')
  @ZodResponse({ type: [ChannelOverwriteDto] })
  listCategoryOverwrites(
    @Param('serverId') serverId: string,
    @Param('categoryId') categoryId: string,
    @CurrentUser() userId: string
  ) {
    return this.overwrites.listCategoryOverwrites({ serverId, categoryId, userId });
  }

  @Post('categories/:categoryId/overwrites')
  @ZodResponse({ type: ChannelOverwriteDto })
  putCategoryOverwrite(
    @Param('serverId') serverId: string,
    @Param('categoryId') categoryId: string,
    @Body() body: PutOverwriteDto,
    @CurrentUser() userId: string
  ) {
    return this.overwrites.putCategoryOverwrite({ serverId, categoryId, input: body, userId });
  }

  @Get('read-states')
  @ZodResponse({ type: [ChannelReadStateDto] })
  listReadStates(@Param('serverId') serverId: string, @CurrentUser() userId: string) {
    return this.readState.listReadStates({ serverId, userId });
  }
}
