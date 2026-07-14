import { OpenAPIHono } from '@hono/zod-openapi';

import { reportProblemHandler } from './handlers';
import { reportProblemRoute } from './routes';

import type { Env } from '../../shared/types';

export const feedbackRouter = new OpenAPIHono<Env>().openapi(
  reportProblemRoute,
  reportProblemHandler,
);
