import type { ChannelReadState, RealtimeServerMessage, Server } from '@chatovo/schemas';
import type { QueryClient } from '@tanstack/react-query';

import { match } from 'ts-pattern';

import { noteChannelActivity, noteTyping } from '@/entities/server/channel';
import { QUERY_KEYS } from '@/shared/constants';

const invalidateTree = (queryClient: QueryClient, serverId: string) => {
  void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
};

export const applyServerRealtime = (
  queryClient: QueryClient,
  message: RealtimeServerMessage,
  currentUserId: string | null
): void => {
  match(message)
    .with(
      { type: 'channel.create' },
      { type: 'channel.update' },
      { type: 'channel.delete' },
      { type: 'channel.reorder' },
      { type: 'category.create' },
      { type: 'category.update' },
      { type: 'category.delete' },
      { type: 'permissions.update' },
      ({ serverId }) => invalidateTree(queryClient, serverId)
    )
    .with({ type: 'server.update' }, ({ server }) => {
      queryClient.setQueryData<Server>(QUERY_KEYS.server(server.id), server);
      queryClient.setQueryData<Server[]>(QUERY_KEYS.servers(), (prev) =>
        (prev ?? []).map((item) => (item.id === server.id ? server : item))
      );
    })
    .with({ type: 'server.delete' }, ({ serverId }) => {
      queryClient.setQueryData<Server[]>(QUERY_KEYS.servers(), (prev) =>
        (prev ?? []).filter((item) => item.id !== serverId)
      );
      queryClient.removeQueries({ queryKey: QUERY_KEYS.server(serverId) });
      queryClient.removeQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
    })
    .with({ type: 'member.join' }, { type: 'member.update' }, ({ serverId, member }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverMembers(serverId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.server(serverId) });

      if (member.userId === currentUserId) {
        invalidateTree(queryClient, serverId);
      }
    })
    .with({ type: 'member.leave' }, ({ serverId, userId }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverMembers(serverId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.server(serverId) });

      if (userId === currentUserId) {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.servers() });
        queryClient.removeQueries({ queryKey: QUERY_KEYS.channelTree(serverId) });
      }
    })
    .with({ type: 'role.upsert' }, { type: 'role.delete' }, ({ serverId }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverRoles(serverId) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.serverMembers(serverId) });
      invalidateTree(queryClient, serverId);
    })
    .with({ type: 'thread.upsert' }, { type: 'thread.delete' }, ({ channelId }) => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelThreads(channelId, false) });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.channelThreads(channelId, true) });
    })
    .with({ type: 'read.state' }, ({ state }) => {
      queryClient.setQueriesData<ChannelReadState[]>(
        { queryKey: QUERY_KEYS.readStatesRoot() },
        (prev) => [...(prev ?? []).filter((item) => item.channelId !== state.channelId), state]
      );
    })
    .with({ type: 'chat.message' }, ({ roomId, serverId, message: dto }) => {
      noteChannelActivity(roomId, new Date(dto.createdAt).getTime());

      if (serverId) {
        void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.readStates(serverId) });
      }
    })
    .with({ type: 'channel.typing' }, ({ channelId, threadId, userId, expiresAt }) => {
      if (userId !== currentUserId) {
        noteTyping({ channelId, threadId, userId, expiresAt: new Date(expiresAt).getTime() });
      }
    })
    .otherwise(() => {});
};
