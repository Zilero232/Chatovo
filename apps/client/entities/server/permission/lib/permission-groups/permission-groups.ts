import type { ChannelType, PermissionKey } from '@chatovo/schemas';

import type { PermissionGroup, PermissionGroupKey } from './permission-groups.types';

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: 'general',
    permissions: ['viewChannel', 'manageChannels', 'manageServer', 'manageRoles']
  },
  {
    key: 'membership',
    permissions: ['createInvite', 'kickMembers', 'banMembers', 'manageNicknames', 'changeNickname']
  },
  {
    key: 'text',
    permissions: [
      'sendMessages',
      'embedLinks',
      'attachFiles',
      'addReactions',
      'mentionEveryone',
      'manageMessages',
      'readMessageHistory',
      'createThreads',
      'sendMessagesInThreads',
      'manageThreads'
    ]
  },
  {
    key: 'voice',
    permissions: [
      'connect',
      'speak',
      'stream',
      'useVoiceActivity',
      'prioritySpeaker',
      'muteMembers',
      'deafenMembers',
      'moveMembers',
      'useSoundboard'
    ]
  },
  { key: 'advanced', permissions: ['administrator'] }
];

const SERVER_ONLY: PermissionKey[] = [
  'manageServer',
  'manageRoles',
  'kickMembers',
  'banMembers',
  'manageNicknames',
  'changeNickname',
  'administrator'
];

/** Which permission groups make sense as overwrites on a channel of this type. */
export const groupsForChannelType = (type: ChannelType | null): PermissionGroup[] => {
  if (type === null) {
    return PERMISSION_GROUPS;
  }

  const hidden: PermissionGroupKey[] =
    type === 'voice' ? ['text', 'advanced', 'membership'] : ['voice', 'advanced', 'membership'];

  return PERMISSION_GROUPS.filter((group) => !hidden.includes(group.key)).map((group) => ({
    ...group,
    permissions: group.permissions.filter((permission) => !SERVER_ONLY.includes(permission))
  }));
};
