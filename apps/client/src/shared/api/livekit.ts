import type { TokenRequest, TokenResponse } from '@solvex/shared';
import { env } from '@/shared/config';

export const fetchLiveKitToken = async (
  body: TokenRequest,
  supabaseAccessToken: string,
): Promise<TokenResponse> => {
  const res = await fetch(`${env.VITE_TOKEN_SERVER_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAccessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token request failed (${res.status}): ${text}`);
  }

  return (await res.json()) as TokenResponse;
};
