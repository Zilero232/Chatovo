import { api } from '../http';

import type { TokenRequest, TokenResponse } from '@chatovo/schemas';

export const fetchLiveKitToken = async (body: TokenRequest): Promise<TokenResponse> => {
  const { data } = await api.post('/livekit/token', body);

  return data;
};
