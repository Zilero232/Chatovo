import { Module } from '@nestjs/common';

import { PushController } from './push.controller';
import { PushService } from './services';

@Module({
  controllers: [PushController],
  providers: [PushService]
})
export class PushModule {}
