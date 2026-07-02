import { appDownloadsSchema, gitHubReleaseSchema } from '@chatovo/schemas';
import { createRoute } from '@hono/zod-openapi';
import { errorSchema } from '../../shared/schemas';

export const latestReleaseRoute = createRoute({
  method: 'get',
  path: '/releases/latest',
  tags: ['github'],
  summary: 'Get the latest desktop GitHub release',
  responses: {
    200: {
      description: 'Latest desktop release',
      content: { 'application/json': { schema: gitHubReleaseSchema } },
    },
    502: {
      description: 'Upstream error',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});

export const appDownloadsRoute = createRoute({
  method: 'get',
  path: '/releases/downloads',
  tags: ['github'],
  summary: 'Get latest desktop and mobile download assets',
  responses: {
    200: {
      description: 'Merged desktop + mobile release assets',
      content: { 'application/json': { schema: appDownloadsSchema } },
    },
    502: {
      description: 'Upstream error',
      content: { 'application/json': { schema: errorSchema } },
    },
  },
});
