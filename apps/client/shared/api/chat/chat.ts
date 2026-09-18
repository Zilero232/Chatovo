import type { ChatAttachment, ChatMessage, ChatMessagesPage, ChatReaction } from '@chatovo/schemas';

import { api, UPLOAD_TIMEOUT_MS } from '../http';

export const editChatMessage = async (id: string, body: string): Promise<ChatMessage> => {
  const { data } = await api.patch(`/chat/messages/${id}`, { body });

  return data;
};

export const deleteChatMessage = async (id: string): Promise<ChatMessage> => {
  const { data } = await api.delete(`/chat/messages/${id}`);

  return data;
};

export const pinChatMessage = async (id: string, pinned: boolean): Promise<ChatMessage> => {
  const { data } = await api.patch(`/chat/messages/${id}/pin`, { pinned });

  return data;
};

export const fetchPinnedMessages = async (roomId: string): Promise<ChatMessage[]> => {
  const { data } = await api.get('/chat/pins', { params: { roomId } });

  return data;
};

export const addChatReaction = async (id: string, emoji: string): Promise<ChatReaction[]> => {
  const { data } = await api.put(`/chat/messages/${id}/reactions`, { emoji });

  return data;
};

export const removeChatReaction = async (id: string, emoji: string): Promise<ChatReaction[]> => {
  const { data } = await api.delete(`/chat/messages/${id}/reactions/${encodeURIComponent(emoji)}`);

  return data;
};

export const uploadChatAttachment = async (roomId: string, file: File): Promise<ChatAttachment> => {
  const fd = new FormData();
  fd.append('roomId', roomId);
  fd.append('file', file);

  const { data } = await api.post('/chat/attachments', fd, { timeout: UPLOAD_TIMEOUT_MS });

  return data;
};

export const sendChatMessage = async (
  id: string,
  roomId: string,
  body: string,
  threadId?: string | null,
  replyToId?: string | null
): Promise<ChatMessage> => {
  const { data } = await api.post('/chat/messages', {
    id,
    roomId,
    body,
    threadId,
    replyToId
  });

  return data;
};

export const fetchChatMessages = async (
  roomId: string,
  cursor?: string,
  limit = 50,
  threadId?: string | null
): Promise<ChatMessagesPage> => {
  const { data } = await api.get('/chat/messages', {
    params: { roomId, limit, ...(cursor ? { cursor } : {}), ...(threadId ? { threadId } : {}) }
  });

  return data;
};
