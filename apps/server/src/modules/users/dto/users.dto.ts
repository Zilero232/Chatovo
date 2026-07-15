import { userProfileSchema } from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateProfileFormSchema = z.object({
  displayName: z.string(),
  profileUrl: z.string(),
  bannerColor: z.string(),
  bio: z.string(),
  removeAvatar: z.string().optional(),
});

export class UpdateProfileDto extends createZodDto(updateProfileFormSchema) {}

export class UserProfileDto extends createZodDto(userProfileSchema) {}
