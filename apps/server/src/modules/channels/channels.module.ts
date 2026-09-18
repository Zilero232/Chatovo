import { Module } from '@nestjs/common';

import { ChannelsController } from './channels.controller';
import { ServerChannelsController } from './server-channels.controller';
import {
  CategoriesService,
  ChannelsService,
  OverwritesService,
  ReadStateService,
  ThreadsService
} from './services';
import { ThreadTagsController } from './thread-tags.controller';
import { ThreadsController } from './threads.controller';

@Module({
  controllers: [
    ServerChannelsController,
    ChannelsController,
    ThreadsController,
    ThreadTagsController
  ],
  providers: [
    ChannelsService,
    CategoriesService,
    OverwritesService,
    ThreadsService,
    ReadStateService
  ],
  exports: [ChannelsService, CategoriesService, OverwritesService, ThreadsService, ReadStateService]
})
export class ChannelsModule {}
