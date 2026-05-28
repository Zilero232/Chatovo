import { z } from 'zod';

// Message is an i18n key under `room.password`, resolved by the form.
export const passwordSchema = z.object({
  password: z.string().trim().min(1, 'required'),
});
