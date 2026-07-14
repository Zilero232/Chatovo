import { OpenAPIHono } from '@hono/zod-openapi';

import { appDownloadsHandler, latestReleaseHandler } from './handlers';
import { appDownloadsRoute, latestReleaseRoute } from './routes';

import type { Env } from '../../shared/types';

export const githubRouter = new OpenAPIHono<Env>()
  .openapi(latestReleaseRoute, latestReleaseHandler)
  .openapi(appDownloadsRoute, appDownloadsHandler);
