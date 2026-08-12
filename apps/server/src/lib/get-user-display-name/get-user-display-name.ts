import { basePrisma as prisma } from '../../core';
import { resolveDisplayName } from '../../modules/users';

export const getUserDisplayName = async (userId: string): Promise<string> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, profile: { select: { displayName: true } } }
  });

  return resolveDisplayName({
    displayName: user?.profile?.displayName,
    name: user?.name,
    userId
  });
};
