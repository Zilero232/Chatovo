import type { updateProfileBodySchema } from '@chatovo/schemas';
import type { z } from 'zod';

export type UploadedAvatar = {
  buffer: Buffer;
  mimetype: string;
  size: number;
};

export type UpdateProfileServiceInput = z.infer<typeof updateProfileBodySchema> & {
  avatar?: UploadedAvatar;
};
