import { z } from 'zod';

import {
  LINK_PREVIEW_DESCRIPTION_MAX_LENGTH,
  LINK_PREVIEW_SITE_NAME_MAX_LENGTH,
  LINK_PREVIEW_TITLE_MAX_LENGTH
} from './limits';

export const linkPreviewImageSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
  width: z.number().int().positive(),
  height: z.number().int().positive()
});

export const linkPreviewSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
  title: z.string().min(1).max(LINK_PREVIEW_TITLE_MAX_LENGTH),
  description: z.string().max(LINK_PREVIEW_DESCRIPTION_MAX_LENGTH).nullable(),
  siteName: z.string().max(LINK_PREVIEW_SITE_NAME_MAX_LENGTH).nullable(),
  image: linkPreviewImageSchema.nullable()
});

export const linkPreviewResponseSchema = z.object({
  preview: linkPreviewSchema.nullable()
});
