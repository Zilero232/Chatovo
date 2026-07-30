import { Module } from '@nestjs/common';

import { LivekitController } from './livekit.controller';
import { LivekitService, WebhookService } from './services';

@Module({
  controllers: [LivekitController],
  providers: [LivekitService, WebhookService]
})
export class LivekitModule {}
