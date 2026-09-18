import { roomSchema } from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class RoomDto extends createZodDto(roomSchema) {}
