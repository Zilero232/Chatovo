'use client';

import { useSyncExternalStore } from 'react';

type TypingEntry = {
  expiresAt: number;
  userId: string;
};

const activity = new Map<string, number>();
const typing = new Map<string, TypingEntry[]>();
const listeners = new Set<() => void>();

const EMPTY_TYPING: string[] = [];
const typingSnapshots = new Map<string, string[]>();

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const typingKey = (channelId: string, threadId: string | null) => `${channelId}:${threadId ?? ''}`;

const pruneTyping = (key: string) => {
  const now = Date.now();
  const alive = (typing.get(key) ?? []).filter((entry) => entry.expiresAt > now);

  if (alive.length === 0) {
    typing.delete(key);
    typingSnapshots.delete(key);
  } else {
    typing.set(key, alive);
    typingSnapshots.set(
      key,
      alive.map((entry) => entry.userId)
    );
  }
};

export const noteChannelActivity = (channelId: string, timestamp: number) => {
  const previous = activity.get(channelId) ?? 0;

  if (timestamp <= previous) {
    return;
  }

  activity.set(channelId, timestamp);
  notify();
};

export const noteTyping = ({
  channelId,
  threadId,
  userId,
  expiresAt
}: {
  channelId: string;
  threadId: string | null;
  userId: string;
  expiresAt: number;
}) => {
  const key = typingKey(channelId, threadId);
  const rest = (typing.get(key) ?? []).filter((entry) => entry.userId !== userId);

  typing.set(key, [...rest, { userId, expiresAt }]);
  pruneTyping(key);
  notify();

  setTimeout(
    () => {
      pruneTyping(key);
      notify();
    },
    Math.max(0, expiresAt - Date.now()) + 50
  );
};

export const useChannelActivity = (channelId: string | null) =>
  useSyncExternalStore(
    subscribe,
    () => (channelId ? (activity.get(channelId) ?? null) : null),
    () => null
  );

export const useTypingUsers = ({
  channelId,
  threadId
}: {
  channelId: string | null;
  threadId: string | null;
}) =>
  useSyncExternalStore(
    subscribe,
    () =>
      channelId
        ? (typingSnapshots.get(typingKey(channelId, threadId)) ?? EMPTY_TYPING)
        : EMPTY_TYPING,
    () => EMPTY_TYPING
  );
