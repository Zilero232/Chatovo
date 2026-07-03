import { api, readErrorMessage } from '../http';
import type { TokenRequest, TokenResponse } from '@chatovo/schemas';

export const fetchLiveKitToken = async (body: TokenRequest): Promise<TokenResponse> => {
  try {
    const res = await api.livekit.token.$post({ json: body });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `LiveKit token failed: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('LiveKit token failed');
  }
};
