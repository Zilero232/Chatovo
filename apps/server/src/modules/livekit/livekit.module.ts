import { Module } from '@nestjs/common';

import { LivekitController } from './livekit.controller';
import { LivekitService } from './livekit.service';
import { WebhookService } from './webhook.service';

@Module({
  controllers: [LivekitController],
  providers: [LivekitService, WebhookService],
})
export class LivekitModule {}
