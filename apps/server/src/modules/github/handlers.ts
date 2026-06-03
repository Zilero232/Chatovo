import { gitHubReleaseSchema } from '@chatovo/schemas';
import { StatusCodes } from 'http-status-codes';
import type { RouteHandler } from '@hono/zod-openapi';
import type { Env } from '../../shared/types';
import type { latestReleaseRoute } from './routes';

const REPO = 'Zilero232/Chatovo';

export const latestReleaseHandler: RouteHandler<typeof latestReleaseRoute, Env> = async (c) => {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'chatovo-server' },
  });

  if (!res.ok) {
    return c.json(
      { error: `Failed to fetch latest release: ${res.status}` },
      StatusCodes.BAD_GATEWAY,
    );
  }

  const parsed = gitHubReleaseSchema.safeParse(await res.json());

  if (!parsed.success) {
    return c.json({ error: 'Invalid release payload' }, StatusCodes.BAD_GATEWAY);
  }

  return c.json(parsed.data, StatusCodes.OK);
};
