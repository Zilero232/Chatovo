import { tokenRequestSchema, tokenResponseSchema } from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class TokenRequestDto extends createZodDto(tokenRequestSchema) {}

export class TokenResponseDto extends createZodDto(tokenResponseSchema) {}
