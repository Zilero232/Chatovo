import type { FilterAccessibleServersInput } from './filter-accessible-servers.types';

import { basePrisma as prisma } from '../../core';

export const filterAccessibleServers = async ({
  serverIds,
  userId
}: FilterAccessibleServersInput): Promise<string[]> => {
  if (serverIds.length === 0) {
    return [];
  }

  const members = await prisma.serverMember.findMany({
    where: { serverId: { in: serverIds }, userId },
    select: { serverId: true }
  });

  return members.map((member) => member.serverId);
};
