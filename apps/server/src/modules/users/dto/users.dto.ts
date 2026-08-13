import { developerListSchema, updateProfileBodySchema, userProfileSchema } from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class UpdateProfileDto extends createZodDto(updateProfileBodySchema) {}

export class UserProfileDto extends createZodDto(userProfileSchema) {}

export class DeveloperListDto extends createZodDto(developerListSchema) {}
