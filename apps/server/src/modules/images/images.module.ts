import { Module } from '@nestjs/common';

import { ImagesController } from './images.controller';
import { ImageCacheSweeperService, ImagesService } from './services';

@Module({
  controllers: [ImagesController],
  providers: [ImageCacheSweeperService, ImagesService]
})
export class ImagesModule {}
