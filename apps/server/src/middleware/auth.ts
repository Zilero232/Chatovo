import type { User } from '@supabase/supabase-js';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { supabaseAdmin } from '@/services/supabase';

export interface AuthVariables {
  user: User;
}

export const requireSupabaseUser = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const header = c.req.header('Authorization');
    const token = header?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) throw new HTTPException(401, { message: 'Missing bearer token' });

    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) throw new HTTPException(401, { message: 'Invalid Supabase token' });

    c.set('user', data.user);
    await next();
  },
);
