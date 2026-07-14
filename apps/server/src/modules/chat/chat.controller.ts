import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ChatService } from './chat.service';
import {
  EditMessageDto,
  ListMessagesQueryDto,
  SendMessageDto,
  UploadAttachmentDto,
} from './dto/chat.dto';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post('attachments')
  @UseInterceptors(FileInterceptor('file'))
  uploadAttachment(
    @Body() body: UploadAttachmentDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() userId: string,
  ) {
    return this.chat.uploadAttachment(body.roomId, file, userId);
  }

  @Post('messages')
  sendMessage(@Body() body: SendMessageDto, @CurrentUser() userId: string) {
    return this.chat.sendMessage(body, userId);
  }

  @Get('messages')
  listMessages(@Query() query: ListMessagesQueryDto, @CurrentUser() userId: string) {
    return this.chat.listMessages(query, userId);
  }

  @Patch('messages/:id')
  editMessage(
    @Param('id') id: string,
    @Body() body: EditMessageDto,
    @CurrentUser() userId: string,
  ) {
    return this.chat.editMessage(id, body, userId);
  }

  @Delete('messages/:id')
  deleteMessage(@Param('id') id: string, @CurrentUser() userId: string) {
    return this.chat.deleteMessage(id, userId);
  }
}
