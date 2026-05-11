import { app } from '@/app';
import { env } from '@/env';

console.log(`[token-server] listening on http://localhost:${env.PORT}`);

export default { fetch: app.fetch, port: env.PORT };
