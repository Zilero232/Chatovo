import { z } from 'zod';

import {
  IMAGE_DEFAULT_QUALITY,
  IMAGE_QUALITIES,
  IMAGE_SOURCE_URL_MAX_LENGTH,
  IMAGE_WIDTHS
} from './limits';

export const optimizeImageQuerySchema = z.object({
  url: z.url({ protocol: /^https?$/ }).max(IMAGE_SOURCE_URL_MAX_LENGTH),
  w: z.coerce
    .number()
    .int()
    .refine((width) => IMAGE_WIDTHS.includes(width)),
  q: z.coerce
    .number()
    .int()
    .refine((quality) => IMAGE_QUALITIES.includes(quality))
    .default(IMAGE_DEFAULT_QUALITY)
});
