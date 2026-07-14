import { reportProblemSchema } from '@chatovo/schemas';
import { createRoute, z } from '@hono/zod-openapi';

import { errorSchema } from '../../shared/schemas';

const reportProblemFormSchema = reportProblemSchema.extend({
  screenshot: z.instanceof(File).optional(),
});

export const reportProblemRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['feedback'],
  summary: 'Send a bug report / feedback to support',
  security: [{ bearerAuth: [] }],
  request: {
    body: {
      required: true,
      content: { 'multipart/form-data': { schema: reportProblemFormSchema } },
    },
  },
  responses: {
    200: {
      description: 'Report sent',
      content: { 'application/json': { schema: z.object({ ok: z.boolean() }) } },
    },
    400: {
      description: 'Invalid input',
      content: { 'application/json': { schema: errorSchema } },
    },
    500: {
      description: 'Failed to send report',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});
