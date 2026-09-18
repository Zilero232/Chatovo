import { Module } from '@nestjs/common';

import { ChannelsModule } from '../channels';
import { ChatController } from './chat.controller';
import { ChatAttachmentService, ChatMessageService } from './services';

@Module({
  imports: [ChannelsModule],
  controllers: [ChatController],
  providers: [ChatAttachmentService, ChatMessageService]
})
export class ChatModule {}
