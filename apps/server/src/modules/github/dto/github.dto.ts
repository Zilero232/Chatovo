import { appDownloadsSchema, gitHubContributorListSchema } from '@chatovo/schemas/github';
import { createZodDto } from 'nestjs-zod';

export class AppDownloadsDto extends createZodDto(appDownloadsSchema) {}

export class ContributorListDto extends createZodDto(gitHubContributorListSchema) {}
