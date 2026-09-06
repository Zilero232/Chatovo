import { Module } from '@nestjs/common';

import { AppConfigService } from '../../config/config.module';
import { LivekitController } from './livekit.controller';
import { bindLivekitCredentials } from './presence';
import { LivekitService, WebhookService } from './services';

@Module({
  controllers: [LivekitController],
  providers: [LivekitService, WebhookService]
})
export class LivekitModule {
  constructor(config: AppConfigService) {
    bindLivekitCredentials({
      url: config.get('LIVEKIT_URL'),
      apiKey: config.get('LIVEKIT_API_KEY'),
      apiSecret: config.get('LIVEKIT_API_SECRET')
    });
  }
}
