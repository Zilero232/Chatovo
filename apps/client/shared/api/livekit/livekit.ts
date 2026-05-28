import { api, readErrorMessage } from '../http';
import type { MicStateRequest, TokenRequest, TokenResponse } from '@chatovo/schemas';

export const fetchLiveKitToken = async (body: TokenRequest): Promise<TokenResponse> => {
  try {
    const res = await api.livekit.token.$post({ json: body });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `LiveKit token failed: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) throw error;

    throw new Error('LiveKit token failed');
  }
};

// Fire-and-forget: presence cache is best-effort and a missed mic-state update
// will be reconciled the next time the participant joins.
export const reportMicState = async (body: MicStateRequest): Promise<void> => {
  try {
    const res = await api.livekit['mic-state'].$post({ json: body });

    if (!res.ok) {
      const message = await readErrorMessage(res);

      throw new Error(message ?? `mic-state failed: ${res.status}`);
    }
  } catch (error) {
    if (error instanceof Error) throw error;

    throw new Error('mic-state failed');
  }
};
