import { Module } from '@nestjs/common';

import { PushListener, TelegramListener } from './listeners';

@Module({
  providers: [PushListener, TelegramListener]
})
export class NotificationsModule {}
