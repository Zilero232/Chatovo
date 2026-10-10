import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheableMemory } from 'cacheable';
import { Keyv } from 'keyv';

import { LINK_UNFURL } from './config';
import { LinkPreviewController } from './link-preview.controller';
import { LinkPreviewSweeperService, LinkUnfurlService, RoomPreviewService } from './services';

@Module({
  imports: [
    CacheModule.register({
      stores: [new Keyv({ store: new CacheableMemory({ lruSize: LINK_UNFURL.cacheMaxEntries }) })]
    })
  ],
  controllers: [LinkPreviewController],
  providers: [LinkPreviewSweeperService, LinkUnfurlService, RoomPreviewService]
})
export class LinkPreviewModule {}
