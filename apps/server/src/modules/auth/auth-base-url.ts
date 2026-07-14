import { validateEnv } from '../../config/env.schema';

const env = validateEnv(process.env);

const DEV_ALLOWED_HOSTS = ['localhost:*', '127.0.0.1:*', '10.0.2.2:*'] as const;

export const authBaseURL = () => {
  if (env.NODE_ENV === 'production') {
    return env.BETTER_AUTH_URL;
  }

  const extraHosts = env.AUTH_DEV_ALLOWED_HOSTS?.split(',')
    .map((host) => host.trim())
    .filter((host) => host.length > 0);

  return {
    allowedHosts: [...DEV_ALLOWED_HOSTS, ...(extraHosts ?? [])],
    fallback: env.BETTER_AUTH_URL,
    protocol: 'http' as const,
  };
};
