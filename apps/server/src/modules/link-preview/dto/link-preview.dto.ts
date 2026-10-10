import {
  linkPreviewQuerySchema,
  linkPreviewResponseSchema,
  roomPreviewQuerySchema
} from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class RoomPreviewQueryDto extends createZodDto(roomPreviewQuerySchema) {}

export class LinkPreviewQueryDto extends createZodDto(linkPreviewQuerySchema) {}

export class LinkPreviewResponseDto extends createZodDto(linkPreviewResponseSchema) {}
