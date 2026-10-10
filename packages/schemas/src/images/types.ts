import type { z } from 'zod';

import type { optimizeImageQuerySchema } from './inputs';

export type OptimizeImageQuery = z.infer<typeof optimizeImageQuerySchema>;
