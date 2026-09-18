'use client';

import { useSearchParams } from 'next/navigation';

import { useServerMembers, useServerRoles } from '@/entities/server/member';

import type { MentionLookup } from '../lib';

/** Names for the `<@id>` tokens of the server currently open in the route. */
export const useMentionLookup = (): MentionLookup => {
  const params = useSearchParams();

  const serverId = params.get('id');

  const { members } = useServerMembers(serverId);
  const { roles } = useServerRoles(serverId);

  return {
    users: new Map(
      members.map((member) => [member.userId, { label: member.nickname ?? member.displayName }])
    ),
    roles: new Map(roles.map((role) => [role.id, { label: role.name, color: role.color }]))
  };
};
