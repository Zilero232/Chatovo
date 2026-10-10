import { optimizeImageQuerySchema } from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class OptimizeImageQueryDto extends createZodDto(optimizeImageQuerySchema) {}
