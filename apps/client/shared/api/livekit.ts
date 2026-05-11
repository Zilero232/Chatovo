import type { TokenRequest, TokenResponse } from '@solvex/shared';

import { api } from './client';

export const fetchLiveKitToken = (body: TokenRequest, supabaseAccessToken: string) =>
  api
    .post('token', {
      json: body,
      headers: { Authorization: `Bearer ${supabaseAccessToken}` },
    })
    .json<TokenResponse>();
