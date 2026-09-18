'use client';

import { sortBy } from 'remeda';

import { useServerMembers, useServerRoles } from '@/entities/server/member';

/** Avatar and highest-positioned coloured role per member, so the message list can tint names like Discord. */
export const useMemberStyling = (serverId: string | null) => {
  const { members } = useServerMembers(serverId);
  const { roles } = useServerRoles(serverId);

  const coloredRoles = sortBy(
    roles.filter((role) => role.color !== null),
    (role) => -role.position
  );

  const byUserId = new Map(
    members.map((member) => {
      const roleIds = new Set(member.roleIds);
      const topRole = coloredRoles.find((role) => roleIds.has(role.id));

      return [
        member.userId,
        {
          avatarUrl: member.avatarUrl,
          roleColor: topRole?.color ?? null
        }
      ];
    })
  );

  return { byUserId };
};
