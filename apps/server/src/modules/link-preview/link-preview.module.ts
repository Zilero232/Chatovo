import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { createUnfurlStore } from './lib';
import { LinkPreviewController } from './link-preview.controller';
import { LinkPreviewSweeperService, LinkUnfurlService, RoomPreviewService } from './services';

@Module({
  imports: [CacheModule.register({ stores: [createUnfurlStore()] })],
  controllers: [LinkPreviewController],
  providers: [LinkPreviewSweeperService, LinkUnfurlService, RoomPreviewService]
})
export class LinkPreviewModule {}
