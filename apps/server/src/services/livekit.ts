import { AccessToken } from 'livekit-server-sdk';

import { env } from '@/env';

export type ParticipantRole = 'admin' | 'user';

type IssueTokenInput = {
  room: string;
  identity: string;
  name: string;
  role: ParticipantRole;
};

export const issueLiveKitToken = async ({ room, identity, name, role }: IssueTokenInput) => {
  const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity,
    name,
    ttl: 60 * 60,
  });

  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomCreate: role === 'admin',
    roomAdmin: role === 'admin',
  });

  return {
    token: await at.toJwt(),
    url: env.LIVEKIT_URL,
  };
};
