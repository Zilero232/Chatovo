import type { PermissionKey } from '@chatovo/schemas';

import { canInChannel, canOnServer, readChannelPermissions } from '../../lib/permissions';
import { useChannelTree } from './use-channel-tree';

export const useChannelPermissions = ({
  serverId,
  channelId
}: {
  serverId: string | null;
  channelId: string | null;
}) => {
  const { tree } = useChannelTree(serverId);

  const can = (permission: PermissionKey) =>
    channelId === null ? canOnServer(tree, permission) : canInChannel(tree, channelId, permission);

  return {
    can,
    permissions: channelId === null ? 0n : readChannelPermissions(tree, channelId)
  };
};
