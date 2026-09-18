export const PERMISSIONS = {
  viewChannel: 1n << 0n,
  manageChannels: 1n << 1n,
  manageServer: 1n << 2n,
  manageRoles: 1n << 3n,
  createInvite: 1n << 4n,
  kickMembers: 1n << 5n,
  banMembers: 1n << 6n,
  manageNicknames: 1n << 7n,
  changeNickname: 1n << 8n,

  sendMessages: 1n << 9n,
  embedLinks: 1n << 10n,
  attachFiles: 1n << 11n,
  addReactions: 1n << 12n,
  mentionEveryone: 1n << 13n,
  manageMessages: 1n << 14n,
  readMessageHistory: 1n << 15n,
  createThreads: 1n << 16n,
  sendMessagesInThreads: 1n << 17n,
  manageThreads: 1n << 18n,

  connect: 1n << 19n,
  speak: 1n << 20n,
  stream: 1n << 21n,
  useVoiceActivity: 1n << 22n,
  prioritySpeaker: 1n << 23n,
  muteMembers: 1n << 24n,
  deafenMembers: 1n << 25n,
  moveMembers: 1n << 26n,
  useSoundboard: 1n << 27n,

  administrator: 1n << 28n
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

export const PERMISSION_KEYS = Object.keys(PERMISSIONS) as PermissionKey[];

export const ALL_PERMISSIONS = PERMISSION_KEYS.reduce((acc, key) => acc | PERMISSIONS[key], 0n);

export const DEFAULT_ROLE_PERMISSIONS =
  PERMISSIONS.viewChannel |
  PERMISSIONS.createInvite |
  PERMISSIONS.changeNickname |
  PERMISSIONS.sendMessages |
  PERMISSIONS.embedLinks |
  PERMISSIONS.attachFiles |
  PERMISSIONS.addReactions |
  PERMISSIONS.readMessageHistory |
  PERMISSIONS.createThreads |
  PERMISSIONS.sendMessagesInThreads |
  PERMISSIONS.connect |
  PERMISSIONS.speak |
  PERMISSIONS.stream |
  PERMISSIONS.useVoiceActivity |
  PERMISSIONS.useSoundboard;

/** Permissions that only make sense on a given channel type. */
export const TEXT_ONLY_PERMISSIONS =
  PERMISSIONS.sendMessages |
  PERMISSIONS.embedLinks |
  PERMISSIONS.attachFiles |
  PERMISSIONS.addReactions |
  PERMISSIONS.mentionEveryone |
  PERMISSIONS.manageMessages |
  PERMISSIONS.readMessageHistory |
  PERMISSIONS.createThreads |
  PERMISSIONS.sendMessagesInThreads |
  PERMISSIONS.manageThreads;

export const VOICE_ONLY_PERMISSIONS =
  PERMISSIONS.connect |
  PERMISSIONS.speak |
  PERMISSIONS.stream |
  PERMISSIONS.useVoiceActivity |
  PERMISSIONS.prioritySpeaker |
  PERMISSIONS.muteMembers |
  PERMISSIONS.deafenMembers |
  PERMISSIONS.moveMembers |
  PERMISSIONS.useSoundboard;
