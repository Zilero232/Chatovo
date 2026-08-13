export const QUERY_KEYS = {
  chatMessagesRoot: () => ['chat-messages'] as const,
  chatMessages: (roomId: string) => ['chat-messages', roomId] as const,
  developers: () => ['developers'] as const,
  friendRequestsIncoming: () => ['friend-requests-incoming'] as const,
  friendCallIncoming: () => ['friend-call-incoming'] as const,
  friendCallOutgoing: () => ['friend-call-outgoing'] as const,
  friendByTag: (tag: string) => ['friend-by-tag', tag] as const,
  friends: () => ['friends'] as const,
  friendshipRelations: () => ['friendship-relation'] as const,
  friendshipRelation: (userId: string) => ['friendship-relation', userId] as const,
  release: () => ['release'] as const,
  livekitToken: (roomName: string | null, password?: string) =>
    ['livekit-token', roomName, password ?? null] as const,
  room: (id: string | null) => ['room', id] as const,
  rooms: () => ['rooms'] as const,
  userProfile: (id: string) => ['user-profile', id] as const
};
