import type { z } from 'zod';

import type { updateProfileInputSchema } from './inputs';
import type { developerListSchema, userProfileSchema } from './outputs';

export type UserProfile = z.infer<typeof userProfileSchema>;

export type UpdateProfilePayload = z.infer<typeof updateProfileInputSchema>;

export type DeveloperList = z.infer<typeof developerListSchema>;
