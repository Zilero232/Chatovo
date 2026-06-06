import { StatusCodes } from 'http-status-codes';
import { reportProblem } from './feedback.service';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { reportProblemRoute } from './routes';

export const reportProblemHandler: RouteHandler<typeof reportProblemRoute, Env> = async (c) => {
  const { screenshot, ...values } = c.req.valid('form');

  await reportProblem({ ...values, screenshot }, c.get('userId'));

  return c.json({ ok: true }, StatusCodes.OK);
};
