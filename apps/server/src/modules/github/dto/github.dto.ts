import { appDownloadsSchema, gitHubReleaseSchema } from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class GitHubReleaseDto extends createZodDto(gitHubReleaseSchema) {}

export class AppDownloadsDto extends createZodDto(appDownloadsSchema) {}
