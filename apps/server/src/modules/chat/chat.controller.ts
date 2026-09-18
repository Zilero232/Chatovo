import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  EditMessageDto,
  ListMessagesQueryDto,
  ListPinnedQueryDto,
  PinMessageDto,
  ReactMessageDto,
  SendMessageDto,
  UploadAttachmentDto
} from './dto/chat.dto';
import { ChatAttachmentService, ChatMessageService } from './services';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly attachments: ChatAttachmentService,
    private readonly messages: ChatMessageService
  ) {}

  @Post('attachments')
  @UseInterceptors(FileInterceptor('file'))
  uploadAttachment(
    @Body() body: UploadAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userId: string
  ) {
    return this.attachments.uploadAttachment({ roomId: body.roomId, file, userId });
  }

  @Post('messages')
  sendMessage(@Body() body: SendMessageDto, @CurrentUser() userId: string) {
    return this.messages.sendMessage({ input: body, senderId: userId });
  }

  @Get('messages')
  listMessages(@Query() query: ListMessagesQueryDto, @CurrentUser() userId: string) {
    return this.messages.listMessages({ query, userId });
  }

  @Patch('messages/:id')
  editMessage(
    @Param('id') messageId: string,
    @Body() body: EditMessageDto,
    @CurrentUser() userId: string
  ) {
    return this.messages.editMessage({ messageId, input: body, senderId: userId });
  }

  @Delete('messages/:id')
  deleteMessage(@Param('id') messageId: string, @CurrentUser() userId: string) {
    return this.messages.deleteMessage({ messageId, senderId: userId });
  }

  @Get('pins')
  listPinnedMessages(@Query() query: ListPinnedQueryDto, @CurrentUser() userId: string) {
    return this.messages.listPinnedMessages({ roomId: query.roomId, userId });
  }

  @Put('messages/:id/reactions')
  addReaction(
    @Param('id') messageId: string,
    @Body() body: ReactMessageDto,
    @CurrentUser() userId: string
  ) {
    return this.messages.addReaction({ messageId, emoji: body.emoji, userId });
  }

  @Delete('messages/:id/reactions/:emoji')
  removeReaction(
    @Param('id') messageId: string,
    @Param('emoji') emoji: string,
    @CurrentUser() userId: string
  ) {
    return this.messages.removeReaction({ messageId, emoji: decodeURIComponent(emoji), userId });
  }

  @Patch('messages/:id/pin')
  pinMessage(
    @Param('id') messageId: string,
    @Body() body: PinMessageDto,
    @CurrentUser() userId: string
  ) {
    return this.messages.pinMessage({ messageId, pinned: body.pinned, userId });
  }
}
