import { reporter } from './shell.mjs';

const log = reporter('env');

export const requireEnv = (keys) => {
  const missing = keys.filter((key) => !process.env[key]);

  if (missing.length) {
    log.fail(
      [
        `missing: ${missing.join(', ')}`,
        '  values come from .env and .env.release — copy .env.example and fill them in'
      ].join('\n')
    );
  }

  return Object.fromEntries(keys.map((key) => [key, process.env[key]]));
};
