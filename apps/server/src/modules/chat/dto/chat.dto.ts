import {
  editMessageInputSchema,
  listMessagesQuerySchema,
  sendMessageInputSchema,
} from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class SendMessageDto extends createZodDto(sendMessageInputSchema) {}

export class EditMessageDto extends createZodDto(editMessageInputSchema) {}

export class ListMessagesQueryDto extends createZodDto(listMessagesQuerySchema) {}

const uploadAttachmentBodySchema = z.object({ roomId: z.uuid() });

export class UploadAttachmentDto extends createZodDto(uploadAttachmentBodySchema) {}
