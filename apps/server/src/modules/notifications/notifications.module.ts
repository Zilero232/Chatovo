import { Module } from '@nestjs/common';

import { TelegramListener } from './telegram.listener';

@Module({
  providers: [TelegramListener],
})
export class NotificationsModule {}
