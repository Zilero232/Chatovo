import {
  editMessageInputSchema,
  listMessagesQuerySchema,
  pinMessageInputSchema,
  reactMessageInputSchema,
  sendMessageInputSchema
} from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class SendMessageDto extends createZodDto(sendMessageInputSchema) {}

export class EditMessageDto extends createZodDto(editMessageInputSchema) {}

export class ListMessagesQueryDto extends createZodDto(listMessagesQuerySchema) {}

export class PinMessageDto extends createZodDto(pinMessageInputSchema) {}

export class ReactMessageDto extends createZodDto(reactMessageInputSchema) {}

export class ListPinnedQueryDto extends createZodDto(z.object({ roomId: z.uuid() })) {}

const uploadAttachmentBodySchema = z.object({ roomId: z.uuid() });

export class UploadAttachmentDto extends createZodDto(uploadAttachmentBodySchema) {}
