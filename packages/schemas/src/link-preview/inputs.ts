import { z } from 'zod';

import { LINK_PREVIEW_URL_MAX_LENGTH } from './limits';

export const linkPreviewQuerySchema = z.object({
  url: z.url({ protocol: /^https?$/ }).max(LINK_PREVIEW_URL_MAX_LENGTH)
});

export const roomPreviewQuerySchema = z.object({
  id: z.uuid().optional().catch(undefined)
});
