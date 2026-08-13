import { appDownloadsSchema } from '@chatovo/schemas/github';
import { createZodDto } from 'nestjs-zod';

export class AppDownloadsDto extends createZodDto(appDownloadsSchema) {}
