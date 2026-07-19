import { Module } from '@nestjs/common';

import { PushListener } from './push.listener';
import { TelegramListener } from './telegram.listener';

@Module({
  providers: [PushListener, TelegramListener],
})
export class NotificationsModule {}
