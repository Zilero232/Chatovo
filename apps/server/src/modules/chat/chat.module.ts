import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatAttachmentService, ChatMessageService } from './services';

@Module({
  controllers: [ChatController],
  providers: [ChatAttachmentService, ChatMessageService]
})
export class ChatModule {}
