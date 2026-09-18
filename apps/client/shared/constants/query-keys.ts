import type {
  AdminReportQuery,
  AdminRoomQuery,
  AdminUserMessageQuery,
  AdminUserQuery
} from '@chatovo/schemas';

const admin = {
  adminStats: () => ['admin-stats'] as const,
  adminUsers: (query: AdminUserQuery) => ['admin-users', query] as const,
  adminUserDetails: (userId: string) => ['admin-user-details', userId] as const,
  adminUserMessages: (userId: string, query: AdminUserMessageQuery) =>
    ['admin-user-messages', userId, query] as const,
  adminRooms: (query: AdminRoomQuery) => ['admin-rooms', query] as const,
  adminReports: (query: AdminReportQuery) => ['admin-reports', query] as const
};

const rooms = {
  room: (id: string | null) => ['room', id] as const,
  livekitToken: (roomId: string | null, invisible?: boolean) =>
    ['livekit-token', roomId, invisible ?? false] as const
};

const servers = {
  servers: () => ['servers'] as const,
  server: (serverId: string | null) => ['server', serverId] as const,
  serverMembers: (serverId: string) => ['server-members', serverId] as const,
  serverRoles: (serverId: string) => ['server-roles', serverId] as const,
  serverInvites: (serverId: string) => ['server-invites', serverId] as const,
  serverInvitePreview: (code: string) => ['server-invite-preview', code] as const,
  serverBans: (serverId: string) => ['server-bans', serverId] as const
};

const channels = {
  channelTree: (serverId: string | null) => ['channel-tree', serverId] as const,
  channel: (channelId: string | null) => ['channel', channelId] as const,
  channelOverwrites: (channelId: string) => ['channel-overwrites', channelId] as const,
  categoryOverwrites: (categoryId: string) => ['category-overwrites', categoryId] as const,
  channelThreads: (channelId: string, archived: boolean) =>
    ['channel-threads', channelId, archived] as const,
  channelThreadTags: (channelId: string) => ['channel-thread-tags', channelId] as const,
  readStatesRoot: () => ['read-states'] as const,
  readStates: (serverId: string | null) => ['read-states', serverId] as const,
  voiceChannels: () => ['voice-channels'] as const
};

const chat = {
  chatMessagesRoot: () => ['chat-messages'] as const,
  chatMessages: (roomId: string) => ['chat-messages', roomId] as const,
  chatThreadMessages: (roomId: string, threadId: string) =>
    ['chat-messages', roomId, threadId] as const,
  chatPinnedMessages: (roomId: string) => ['chat-pinned', roomId] as const
};

const friends = {
  friends: () => ['friends'] as const,
  friendRequestsIncoming: () => ['friend-requests-incoming'] as const,
  friendCallIncoming: () => ['friend-call-incoming'] as const,
  friendCallOutgoing: () => ['friend-call-outgoing'] as const,
  friendsEpoch: () => ['friends-epoch'] as const,
  friendshipRelations: () => ['friendship-relation'] as const,
  friendshipRelation: (userId: string) => ['friendship-relation', userId] as const
};

const users = {
  userProfile: (id: string) => ['user-profile', id] as const
};

const meta = {
  contributors: () => ['contributors'] as const,
  developers: () => ['developers'] as const,
  release: () => ['release'] as const,
  runningGame: () => ['running-game'] as const
};

export const QUERY_KEYS = {
  ...admin,
  ...rooms,
  ...servers,
  ...channels,
  ...chat,
  ...friends,
  ...users,
  ...meta
};
